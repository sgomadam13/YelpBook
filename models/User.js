var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = mongoose.Schema({
    username: String,
    password: String
},
{
    writeConcern: {
        w: "majority",
        j: true,
        wtimeout: 1000
}
});


userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);