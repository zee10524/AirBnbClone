const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const userController = require("../controllers/user.js");

// Signup Routes
router.route("/signup")
    .get((req, res) => {
        res.render("users/signup");
    })
    .post(wrapAsync(userController.renderSignUp));

// Login Routes
router.route("/login")
    .get(userController.renderLoginForm)
    .post(passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true
    }), userController.login);

// Logout Route
router.get("/logout", userController.logout);

module.exports = router;
