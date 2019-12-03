var express = require("express");
var router = express.Router();
var Comment = require("../models/comment");
var Book = require("../models/book");
var middleware = require("../middleware")


//New Comment Route
router.get("/books/:id/comments/new", middleware.isLoggedIn, function(req, res){
    // Find the campground Id and pass it comment to create
    Book.findById(req.params.id, function(err, book){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {book: book});
        }
    });

});

//CREATE comments route
router.post("/books/:id/comments", function(req, res){    

    Book.findById(req.params.id, function(err, book){
        if(err){
            console.log(err);
            res.redirect("/books");
        } else {

            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {

                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username=req.user.username;
                    comment.save();
                    book.comments.push(comment);
                    book.save();
                    req.flash("success", "Successfully added comment");
                    res.redirect("/books/"+book._id);
                }
            });
        }
    });
});

//EDIT comment route
router.get("/books/:id/comments/:commentId/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.commentId, function(err, foundComment){
        if(err) {
            console.log(err);
            res.redirect("/books/"+book.id);
        } else {
            res.render("comments/edit", {book_id: req.params.id, comment:foundComment});
        }
    });
});

//UPDATE comment route
router.put("/books/:id/comments/:commentId", function(req, res){
    Comment.findByIdAndUpdate(req.params.commentId, req.body.comment, function(err, updatedComment){
        if(err){
            console.log(err);
        } else {
            res.redirect("/books/"+req.params.id);
        }
    });
});

//DELETE comment route
router.delete("/books/:id/comments/:commentId", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.commentId, function(err){
        if(err) {
            console.log(err);
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted");
            res.redirect("/books/"+req.params.id);
        }
    })
})

module.exports = router;