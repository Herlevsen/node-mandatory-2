/**
 * Dependencies
 */
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

/**
 * Schema
 */
const ItemSchema = new Schema({
    title: {
        type : String,
        default : '',
        trim : true
    },
    description: {
        type : String,
        default : '',
        trim : true
    },
    owner: {
        type : Schema.ObjectId,
        ref : 'User'
    },
    category: {
        type : Schema.ObjectId,
        ref : 'Category'
    },
    image: {
        cdnUri: String,
        files: []
    },
    createdAt  : {
        type : Date,
        default : Date.now
    }
});

mongoose.model('Item', ItemSchema);