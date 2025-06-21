const Listing = require('./models/listing.js');
const ExpressError = require('./utils/ExpressError.js');
const { listingSchema, reviewSchema } = require("./schema.js");




module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "you must be logged in to create listing!");
        return res.redirect("/login");
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
        let { id } = req.params;
        let listing = await Listing.findById(id);
        if (!listing.owner.equals(req.user._id)) {
            req.flash("error", "You are not the owner of ths listing");
            return res.redirect(`/listings/${id}`);
        }
        next();
}

//middleware for validating listing
module.exports.validateListing = (req, res, next) => {
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

module.exports.validateReview = (req, res, next) => {
    if (!req.body || !req.body.review) {
        throw new ExpressError(400, "Please fill the comments and rating.");
    }
    const { error } = reviewSchema.validate(req.body);
    if (error) throw new ExpressError(400, error.message);

    next();
};
