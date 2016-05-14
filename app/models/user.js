/**
 * Dependencies
 */
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

/**
 * Schema
 */
const UserSchema = new Schema({
    username: {
        type : String,
        trim : true
    },
    password: {
        type : String,
        trim : true,
        select: false
    },
    items: [{
        type : Schema.ObjectId,
        ref : 'Item'
    }],
    image: {
        cdnUri: String,
        files: []
    },
    createdAt  : {
        type : Date,
        default : Date.now
    }
});

mongoose.model('User', UserSchema);