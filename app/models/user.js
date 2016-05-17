/**
 * Dependencies
 */
const mongoose = require('mongoose');
const bcrypt   = require('bcrypt');

const Schema   = mongoose.Schema;

/**
 * Schema
 */
const UserSchema = new Schema({
    username: {
        type : String,
        trim : true,
        unique: true
    },
    password: {
        type : String,
        trim : true
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

mongoose.model('User', UserSchema);