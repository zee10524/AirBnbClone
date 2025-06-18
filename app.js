const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const path = require("path");

const ExpressError = require("./utils/ExpressError");
const session = require("express-session");
const flash = require("connect-flash");

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

const passport = require('passport');
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const user = require("./models/user.js");



// Database connection
async function main() {
    await mongoose.connect(MONGO_URL);
}
main().then(() => {
    console.log("connected to DB");
}).catch((err) => {
    console.log(err);
});

const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};


app.get("/", (req, res) => {
    res.send("Hi ! I am route");
})


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

app.get("/demouser",async(req,res)=>{
    let fakeUser=new User({
        email: "russian@gmail.com",
        username: "delta-student"
    });

    let registerUser = await User.register(fakeUser,"helloWorld");
    res.send(registerUser);
})

// Routes
app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

// Catch-all 404 handler
app.use('/', async (req, res, next) => {
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
