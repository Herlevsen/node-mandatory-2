/**
 * Dependencies
 */
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

/**
 * Schema
 */
const CategorySchema = new Schema({
    title: {
        type : String,
        default : '',
        trim : true
    },
    user: [{
        type : Schema.ObjectId,
        ref : 'User'
    }],
    image: {
        cdnUri: String,
        files: []
    }
});

mongoose.model('Category', CategorySchema);