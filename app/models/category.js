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
    image: {
        type: String,
        trim: true
    }
});

mongoose.model('Category', CategorySchema);