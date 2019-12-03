var express = require("express");

//Creating Router() object
var router = express.Router();
var Book = require("../models/book");
var middleware = require("../middleware");

//INDEX route - Display a list of books
router.get("/", function(req, res){

    Book.find({}, function(err, allBooks){
        if(err) {
            console.log(err);
        } else {
            res.render("books/index", {books:allBooks, currentUser: req.user});
        }
    });
});


//NEW route - show new book form
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("books/new");
});

//CREATE route - create a new book and redirect to show page
router.post("/", function(req, res){
    //get data from form and add to books array
    var name = req.body.name;
    var price = "9.99";
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    
    var newBook = {
        name: name,
        price: price,
        image: image,
        description: desc,
        author: author
    };

    Book.create(newBook, function(err, newlyCreated){
        if(err) {
            console.log(err);
        } else {
            //redirect back to books
            res.redirect("/books");
        }
    });
});

//SHOW route
router.get("/:id", function(req, res){
    //find the book with the provided ID
    Book.findById(req.params.id).populate("comments").exec(function(err, foundBooks){
        if(err) {
            console.log(err);
        } else {
            res.render("books/show", {book: foundBooks, currentUser: req.user});
        }
    });

});

//EDIT route
router.get("/:id/edit", middleware.checkBookOwnership, function(req, res){
    Book.findById(req.params.id, function(err, foundBook){
        if(err) {
            console.log(err);
        } else {
            res.render("books/edit", {book: foundBook});
        }
    });
});

//UPDATE route
router.put("/:id", function(req, res){
    Book.findByIdAndUpdate(req.params.id, req.body.book, function(err, updatedBook){
        if(err) {
            res.redirect("/books");
        } else {
            res.redirect("/books/"+req.params.id);
        }
    });
});

//DELTE route
router.delete("/:id", middleware.checkBookOwnership, function(req, res){
    Book.findOneAndRemove(req.params.id, function(err){
        if(err) {
            console.log(err);
        } else {
            res.redirect("/books");
        }
    })
});


module.exports = router;