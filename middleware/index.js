var Book = require("../models/book");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.checkBookOwnership = function(req, res, next) {
    if(req.isAuthenticated()) {
        Book.findById(req.params.id, function(err, foundBook) {
            if(err) {
                console.log(err);
                res.redirect("/books");
            } else {
                if(foundBook.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        }); 
    } else {
        res.redirect("back");
    }
}

//Comment Ownership
middlewareObj.checkCommentOwnership = function(req, res, next) {
    if(req.isAuthenticated()) {
        Comment.findById(req.params.commentId, function(err, foundComment){
            if(err) {
                res.redirect("/books");
            } else {
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else {
                    res.redirect("back");
                }
            }
        })
    } else {
        res.redirect("back");
    }
}

//isLoggedIn

middlewareObj.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }

    res.redirect("/login");
}

module.exports = middlewareObj;