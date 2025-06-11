const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
       
    },
    description: String,

    image: {
    filename: String,
    url: String
    },
    
    price: {
        type: Number,
        required: true,
        min: 0
    },

    location: String,
    
    country: String,

    reviews:[
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
