var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
    text: String,
    author: {
        id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
        },
        username: String
    }
},
{
    writeConcern: {
        w: "majority",
        j: true,
        wtimeout: 1000
    }

});

module.exports = mongoose.model("Comment", commentSchema);