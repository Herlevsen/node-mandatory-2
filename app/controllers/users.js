/**
 * Dependencies
 */
const mongoose = require('mongoose');

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
        username: req.query,
        password: "Bodnia",
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