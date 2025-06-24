const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");

const Listing = require("../models/listing.js");

const ListingController = require("../controllers/listing.js");

const multer = require("multer");

const {storage}=require("../cloudConfig.js");
const upload =multer({storage});



router
    .route("/") // <-- Yeh slash `/` zaroori hai yeh batata hai kis path ke liye routes hain
    .get(wrapAsync(ListingController.index))
    .post(isLoggedIn,upload.single("listing[image]"),wrapAsync(ListingController.createListing));
   

// New listing form
router.get("/new",isLoggedIn,ListingController.renderNewForm);


//Update route
router.route("/:id")
    // Show a specific listing with its reviews
    .get(wrapAsync(ListingController.showListing))
    // Update listing
    .put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing, wrapAsync(ListingController.updateListing))
    // Delete listing
    .delete(isLoggedIn,isOwner,wrapAsync(ListingController.destroyListing));



// Edit form for a listing
router.get("/:id/edit", isLoggedIn,isOwner,wrapAsync(ListingController.renderEditForm));




module.exports = router;
