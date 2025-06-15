const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError");
const { listingSchema } = require("../schema.js");

const Listing = require("../models/listing.js");

// Middleware to validate listing data
const validateListing = (req, res, next) => {
    if (!req.body || !req.body.listing) {
        throw new ExpressError(400, "Invalid listing data.");
    }

    const { error } = listingSchema.validate(req.body);
    if (error) throw new ExpressError(400, error.message);

    if (req.body.listing.image && typeof req.body.listing.image === "object") {
        req.body.listing.image.filename = req.body.listing.image.filename || "";
    }

    next();
};

// Show all listings
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings }); // ✅ fixed path
}));

// New listing form
router.get("/new", (req, res) => {
    res.render("listings/new"); // ✅ fixed path
});

// Show a specific listing with its reviews
router.get("/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if (listing) {
        res.render("listings/show", { listing }); // ✅ fixed path
    } else {
        throw new ExpressError(404, "Listing not found");
    }
}));

// Create a new listing
router.post("/", validateListing, wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));

// Edit form for a listing
router.get("/:id/edit", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }
    res.render("listings/edit", { listing }); // ✅ fixed path
}));

// Update listing
router.put("/:id", validateListing, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const updatedData = { ...req.body.listing };
    await Listing.findByIdAndUpdate(id, updatedData);
    res.redirect(`/listings/${id}`);
}));

// Delete listing
router.delete("/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));

module.exports = router;
