var mongoose = require("mongoose");

var bookSchema = new mongoose.Schema({
    name: String,
    price: String,
    image: String,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
}, 
{
    writeConcern: {
        w: "majority",
        j: true,
        wtimeout: 1000
    }

});

module.exports = mongoose.model("Book", bookSchema);