var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    request = require("request"),
    mongoose = require("mongoose"),
    methodOverride= require("method-override"),
    passport = require("passport"),
    LocalStrategy = require("passport-local").Strategy,
    passportLocalMongoose = require("passport-local-mongoose"),
    flash = require("connect-flash");
    
    var Book = require("./models/book");
    var Comment = require("./models/comment");
    var User = require("./models/User");
    var commentsRoute = require("./routes/comments");
    var booksRoutes = require("./routes/books");
    var indexRoutes = require("./routes/index");
    


app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+ "/public"));
app.set("view engine", "ejs");
app.use(flash());

//DB connection
process.env.DATABASE_URL="mongodb+srv://sgomadam:mypassword1%21@yelpbook-0glrj.mongodb.net/test?retryWrites=true&w=majority21";
console.log(process.env.DATABASE_URL);
mongoose.connect(process.env.DATABASE_URL);

//Passport
app.use(require("express-session")({
    secret: "This is a secret message",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(methodOverride("_method"));
app.use("/", indexRoutes);
app.use("/books", booksRoutes);
app.use(commentsRoute);
// app.use("/books/:id/comments", commentsRoute);

app.listen((process.env.PORT||3000), process.env.IP, function(){
    console.log("YelpBook has started!");
});
