/**
 * Dependencies
 */
const mongoose = require('mongoose');
const bcrypt   = require('bcrypt');
const validate = require('mongoose-validator');

const Schema   = mongoose.Schema;

/**
 * Validators
 */

var emailValidator = [
    validate({
        validator: 'isEmail',
        passIfEmpty: false,
        message: 'Ikke gyldig email.'
    })
];

var passwordValidator = [
    validate({
        validator: 'isLength',
        arguments: 6,
        message: 'Dit password skal bestå af mere end {ARGS[0]} karakter.'
    })
];

var nameValidator = [
    validate({
        validator: 'isLength',
        arguments: 2,
        message: 'Du skal indtaste et navn på mere end {ARGS[0]} karakter.'
    })
];

/**
 * Schema
 */

const UserSchema = new Schema({
    email: {
        type : String,
        trim : true,
        unique: true,
        validate: emailValidator
    },
    password: {
        type : String,
        trim : true,
        validate: passwordValidator
    },
    name: {
        type: String,
        trim: true,
        validate: nameValidator
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
    },
    admin: {
        type: Boolean,
        default: false
    }
});

UserSchema.pre('save', function (next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});
 
UserSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

UserSchema.methods.isAdmin = function() {
    return this.admin == true
}

mongoose.model('User', UserSchema);