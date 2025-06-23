const express = require("express");
const router = express.Router({mergeParams: true});

const wrapAsync = require("../utils/wrapAsync.js");

const { listingSchema, reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js"); // ✅ Added missing import
const ReviewController  = require("../controllers/review.js");

const {validateReview} = require("../middleware.js");

router.post("/", validateReview, wrapAsync(ReviewController.createReview));

router.delete("/:reviewId", wrapAsync(ReviewController.destroyReview));

module.exports = router; // ✅ Ensure this export is there
