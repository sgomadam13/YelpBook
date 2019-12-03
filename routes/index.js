var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/User");

//INDEX route - Display the landing page
router.get("/", function(req, res){
    res.render("landing");
});

//Register route
router.get("/register", function(req, res){
    res.render("register");
});

//handle signup logic
router.post("/register", function(req, res){
    var newUser = new User({
        username: req.body.username
    });
    User.register(newUser, req.body.password, function(err, user){
        if(err) {
            console.log(err);
            req.flash("error", err.message);
            res.redirect("/books");
            // return res.render("register");
        } else {
            passport.authenticate("local")(req, res, function(){
                req.flash("success", "Welcome to YelpBook "+ user.username);
                res.redirect("/books");
            });
        }
    });
})



//Login Route
router.get("/login", function(req, res){
    res.render("login");
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/books",
    failureRedirect: "/login",
    failureFlash: true
}), function(req, res){

});

//logout route
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/books");
});


module.exports = router;