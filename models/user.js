/**
 * Defines the User schema for MongoDB using Mongoose.
 * Integrates passport-local-mongoose to handle username, hash, and salt fields for authentication.
 * The schema includes an email field which is required.
 */
const mongoose =require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");


const userSchema = new Schema({

    email:{
        type: String ,
        required:true
    },

})

userSchema.plugin(passportLocalMongoose);

module.exports =mongoose.model("User",userSchema);