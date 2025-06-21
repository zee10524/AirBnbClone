const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");

const Listing = require("../models/listing.js");

// Show all listings
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings }); // ✅ fixed path
}));

// New listing form
router.get("/new",isLoggedIn,(req, res) => {

    res.render("listings/new"); // ✅ fixed path
});

// Show a specific listing with its reviews
router.get("/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews").populate("owner");
    if (listing) {
        res.render("listings/show", { listing }); // ✅ fixed path
    } else {
        req.flash("error", "Listing you requested for does not exist");
        return res.redirect("/listings");
    }
   
    
}));

// Create a new listing
// Example: Creating a new listing
router.post("/", isLoggedIn,wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner= req.user._id;
    await newListing.save();
    // res.locals.success = req.flash("success");
   req.flash("success", "New listing created successfully!");
   res.redirect("/listings");

}));

// Edit form for a listing
router.get("/:id/edit", isLoggedIn,isOwner,wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist");
        return res.redirect("/listings");
    }
    res.render("listings/edit", { listing }); // ✅ fixed path
}));

// Update listing
router.put("/:id", isLoggedIn,isOwner,validateListing, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const updatedData = { ...req.body.listing };
    await Listing.findByIdAndUpdate(id, updatedData);
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}));

// Delete listing
router.delete("/:id", isLoggedIn,isOwner,wrapAsync(async (req, res) => {
    const { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}));



module.exports = router;
