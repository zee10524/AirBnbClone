const express = require("express");
const router = express.Router({mergeParams: true});

const wrapAsync = require("../utils/wrapAsync.js");

const { listingSchema, reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js"); // ✅ Added missing import

const {validateReview} = require("../middleware.js");

router.post("/", validateReview, wrapAsync(async (req, res) => {
    console.log(req.params.id);
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "Review created successfully");
    res.redirect(`/listings/${listing._id}`); // ✅ Corrected redirect path
}));

router.delete("/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted successfully");
    res.redirect(`/listings/${id}`); // ✅ Corrected redirect path
}));

module.exports = router; // ✅ Ensure this export is there
