const express= require("express");
const app=express();
const mongoose = require("mongoose");
const port=8080;
const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
const methodOverride= require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/ExpressError");

const Joi= require('joi');
const Listing = require("./models/listing.js");

const {listingSchema , reviewSchema}=require("./schema.js");
const Review = require("./models/review.js")


const path=require("path");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));




async function main() {
    await mongoose.connect(MONGO_URL);
}
main().then(()=>{
    console.log("connected to DB");
    
}).catch((err)=>{

    console.log(err);
    
});



app.get('/',(req,res)=>{

    res.send("Hi ! I am root");
})

const validateListing =(req,res,next)=>{

     const { error } = listingSchema.validate(req.body);
    if (error) throw new ExpressError(400, error.message);

    // Set default filename if missing
    if (req.body.listing.image && typeof req.body.listing.image === "object") {
        req.body.listing.image.filename = req.body.listing.image.filename || "";
    }

    next();
}
const validateReview =(req,res,next)=>{
    // if(req.body===NULL){
    //     throw new ExpressError(400 , "Please Enter comment in valid format");
    // }
    if (!req.body || !req.body.review) {
        throw new ExpressError(400, "Please fill the comments and rating.");
    }
    const { error } = reviewSchema.validate(req.body);
    if (error) throw new ExpressError(400, error.message);

    next();
}

//index route
app.get("/listings", wrapAsync(async(req,res)=>{

   const allListings = await Listing.find({});
   res.render("./listings/index.ejs",{allListings});
}));

//New route 
app.get("/listings/new",(req,res)=>{

    res.render("./listings/new.ejs");

});

//show route 
app.get("/listings/:id", wrapAsync(async(req, res)=>{

    let {id}=req.params;
    const listing = await Listing.findById(id).populate("reviews");


    if(listing){
        res.render("./listings/show.ejs",{listing})
    }


}));


app.post("/listings",validateListing, wrapAsync(async (req, res, next) => {
   
    const newListing = new Listing(req.body.listing);
    await newListing.save();

    res.redirect("/listings");
}));

///edit route
app.get("/listings/:id/edit", wrapAsync(async(req,res)=>{

    console.log("req aayi hai!");
    
     let {id}=req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/edit.ejs",{listing});

}));



// update route
app.put("/listings/:id", validateListing,wrapAsync(async (req, res) => {
   
    let { id } = req.params;
    const updatedData = { ...req.body.listing };

    // // Only set default filename if not provided
    // if (updatedData.image && typeof updatedData.image.url === "string") {
    //     updatedData.image.filename = updatedData.image.filename || "";
    // }

    await Listing.findByIdAndUpdate(id, updatedData);
    res.redirect(`/listings/`);
}));

// ...existing code...

app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));

//reviews
//post review route

app.post("/listings/:id/reviews", validateReview, wrapAsync(async (req, res) => {

     console.log("Review ki req aagyi hai!");
     
     console.log(req.body); // <--- add this
    let listing = await Listing.findById(req.params.id);

    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    console.log("New review saved");
    res.redirect(`/listings/${listing._id}`)

}));

//Post delete route

app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async (req, res) => {

    console.log("🔥 Delete Review Route Hit");
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
}));

app.use('/', async(req, res, next) => {
   throw new ExpressError("Page Not Found!", 404);

});

app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong!" } = err;
    res.render("error.ejs", {err});
});
app.listen(8080,()=>{
    
    console.log("Server is listening to port: "+ port);
        
});