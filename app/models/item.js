/**
 * Dependencies
 */
const mongoose = require('mongoose');
const validate = require('mongoose-validator');
const mongoose_delete = require('mongoose-delete');

const Schema = mongoose.Schema;

/**
 * Validators
 */

var titleValidator = [
    validate({
        validator: 'isLength',
        arguments: [2, 20],
        message: 'Du skal indtaste en titel, mellem {ARGS[0]} og {ARGS[1]} karakter.'
    })
];

var descriptionValidator = [
    validate({
        validator: 'isLength',
        arguments: [2, 200],
        message: 'Du skal indtaste en beskrivelse, mellem {ARGS[0]} og {ARGS[1]} karakter.'
    })
];

/**
 * Schema
 */
const ItemSchema = new Schema({
    title: {
        type: String,
        default: '',
        trim: true,
        validate: titleValidator
    },
    description: {
        type: String,
        default: '',
        trim: true,
        validate: descriptionValidator
    },
    owner: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    category: {
        type: Schema.ObjectId,
        ref: 'Category'
    },
    images: [{
        type: String
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    address: {
        address: {
            type: String,
            trim: true
        },
        cityName: {
            type: String,
            trim: true
        },
        postalCode: {
            type: Number,
            trim: true
        },
        latitude: {
            type: Number,
        },
        longitude: {
            type: Number
        }
    }
});

/**
 *  Add soft delete
 */
ItemSchema.plugin(mongoose_delete, {deletedAt : true, overrideMethods: 'all'});

mongoose.model('Item', ItemSchema);