const express = require("express");
const router = express.Router({mergeParams: true});

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError");

const { listingSchema, reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js"); // ✅ Added missing import

const validateReview = (req, res, next) => {
    if (!req.body || !req.body.review) {
        throw new ExpressError(400, "Please fill the comments and rating.");
    }
    const { error } = reviewSchema.validate(req.body);
    if (error) throw new ExpressError(400, error.message);

    next();
};

router.post("/", validateReview, wrapAsync(async (req, res) => {
    console.log(req.params.id);
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    console.log("New review saved");
    res.redirect(`/listings/${listing._id}`); // ✅ Corrected redirect path
}));

router.delete("/:reviewId", wrapAsync(async (req, res) => {
    console.log("🔥 Delete Review Route Hit");
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`); // ✅ Corrected redirect path
}));

module.exports = router; // ✅ Ensure this export is there
