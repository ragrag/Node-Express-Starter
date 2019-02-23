const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;


//User Schema
const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },


    email: {
        type: String,
        required: false ,
        lowercase: true
    },
    username: {
        type: String,
        required: true
    },

    about: {
        type: String,
        required:false
    },

    displayPicture: {
        data: Buffer,
        contentType: String 
    },

    social :{
        provider : String,
        id : String
    },

    isVerified: { type: Boolean, default: false },

    isAdmin: {
        type: Boolean,
        default: false
    }

});

const User = module.exports = mongoose.model('User',UserSchema);
