const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
router.get("/signup",(req,res)=>{
    res.render("users/signup");
});

router.post("/signUP", async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.flash("success", "Welcome to WanderLust");
        res.redirect("/listings");
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
});

router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
});

router.post("/login", passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
}), (req, res) => {
    req.flash("success", `Welcome back ${req.user.username}!`);
    res.redirect("/listings");
});

router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are logged out !");
        res.redirect("/listings");
    });
});
module.exports = router;