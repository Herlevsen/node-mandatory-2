/**
 * Dependencies
 */
const mongoose = require('mongoose');
const jwt      = require('jwt-simple');

const User = mongoose.model('User');

exports.index = function(req, res) {
    const page  = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const skip  = (page - 1) * limit;

    User.find()
    .select('-__v')
    .limit(limit)
    .skip(skip)
    .sort({name: 'asc'})
    .exec(function(err, users) {
        if(err) {

        }

        res.json({
            data: users
        });
    });
}

exports.create = function(req, res) {

    var user = new User({
        username: req.body.username,
        password: req.body.password,
    });

    user.save(function (err) {
        if (err) {
            return handleError(err);
        }
        // saved!
    });

    res.json({
        test: "Test!"
    });
}

exports.find = function(req, res) {
    User.findOne(req.params.id).select('-__v').exec(function(err, user) {
        if(err) {

        }

        res.json({
            data: user
        });
    });
}

exports.authenticate = function(req, res) {
    User.findOne({ username: req.body.username }, function(err, user) {
        if (err) throw err;

        if (!user) {
            res.send({
                success: false,
                msg: 'Authentication failed. User not found.'
            });
        } else {
            // check if password matches
            user.comparePassword(req.body.password, function(err, isMatch) {
                if (isMatch && !err) {
                    // if user is found and password is right create a token
                    var token = jwt.encode(user, "secret");
                    // return the information including token as JSON
                    res.json({
                        success: true,
                        token: 'JWT ' + token
                    });
                } else {
                    res.send({
                        success: false,
                        msg: 'Authentication failed. Wrong password.'
                    });
                }
            });
        }
    });
}