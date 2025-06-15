const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const path = require("path");

const ExpressError = require("./utils/ExpressError");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

const Listing = require("./models/listing.js");

const port = 8080;
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// View engine and middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

// Database connection
async function main() {
    await mongoose.connect(MONGO_URL);
}
main().then(() => {
    console.log("connected to DB");
}).catch((err) => {
    console.log(err);
});

// Routes
app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

// Catch-all 404 handler
app.use('/', async(req, res, next) => {
   throw new ExpressError("Page Not Found!", 404);
});


// Error handler
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    res.status(statusCode).render("error.ejs", { err });
});

// Server start
app.listen(port, () => {
    console.log("Server is listening to port: " + port);
});
