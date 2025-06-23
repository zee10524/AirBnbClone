const User = require("../models/user");

module.exports.renderSignUp =async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if (err) {
            req.flash("error", err.message);
            return res.redirect("/signup");
            }
            req.flash("success", "Welcome to WanderLust " + registeredUser.username);
            res.redirect("/listings");
        });
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
}


module.exports.renderLoginForm =(req,res)=>{
    res.render("users/login.ejs");
}

module.exports.login =(req, res) => {
    req.flash("success", `Welcome back ${req.user.username}!`);
    res.redirect("/listings");
};

module.exports.logout =(req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are logged out !");
        res.redirect("/listings");
    });
}