const Listing = require("../models/listing")

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings }); // ✅ fixed path
}

module.exports.renderNewForm =(req, res) => {

    res.render("listings/new"); // ✅ fixed path
}

module.exports.showListing =async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews").populate("owner");
    if (listing) {
        res.render("listings/show", { listing }); // ✅ fixed path
    } else {
        req.flash("error", "Listing you requested for does not exist");
        return res.redirect("/listings");
    }
   
}

module.exports.createListing =async (req, res) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner= req.user._id;
    await newListing.save();
    // res.locals.success = req.flash("success");
   req.flash("success", "New listing created successfully!");
   res.redirect("/listings");

}

module.exports.renderEditForm =async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist");
        return res.redirect("/listings");
    }
    res.render("listings/edit", { listing }); // ✅ fixed path
}

module.exports.updateListing =async (req, res) => {
    const { id } = req.params;
    const updatedData = { ...req.body.listing };
    await Listing.findByIdAndUpdate(id, updatedData);
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing =async (req, res) => {
    const { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}