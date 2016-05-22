/**
 * Dependencies
 */
const mongoose = require('mongoose');
const jwt      = require('jwt-simple');

const User = mongoose.model('User');

/**
 * Find all users - Not in use ATM
 */
exports.index = function(req, res, next) {
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
            return next(err);
        }

        res.json({
            success: true,
            data: users
        });
    });
};

/**
 * Create a user
 */
exports.create = function(req, res, next) {

    const address = {
        address: req.body.address.address,
        cityName: req.body.address.cityName,
        postalCode: parseInt(req.body.address.postalCode),
        location: {
            type: 'Point',
            coordinates: req.body.address.coordinates
        }
    };

    var user = new User({
        email: req.body.email,
        password: req.body.password,
        name: req.body.name,
        address: address
    });
    user.save(function (err) {
        if (err) {
            // Duplicate key - bad request
            if(err.code == 11000) {
                res.status(400);
                return res.json({
                    success: false,
                    error: "EmailAlreadyInUse"
                });
            }

            return next(err);
        }

        user.password = undefined;

        // saved!
        res.json({
            success: true,
            data: user
        });
    });
};


/**
 * Find a user by id
 */
exports.find = function(req, res, next) {

    User.findById(req.params.id).select('-__v').exec(function(err, user) {
        if(err) {
            return next(err);
        }

        if(!user) {
            // Not found
            res.status(404);
            return res.json({
                success: false,
                error: "UserNotFound"
            });
        }

        return res.json({
            success: true,
            data: user
        });
    });
};

/**
 * Request a JWT authentication token
 */
exports.authenticate = function(req, res) {
    User.findOne({ email: req.body.email } ).select("+password").exec(function(err, user) {
        if (err) {
            return next(err);
        }

        // Email not found - for security reason response is same as when password is not right
        if (!user) {
            return userNotFound(res);
        }

        // Check if password matches
        user.comparePassword(req.body.password, function(err, isMatch) {
            if (isMatch && !err) {
                // if user is found and password is right create a token
                user.password = undefined;
                var token = jwt.encode(user, "secret");

                // return the information including token as JSON
                return res.json({
                    success: true,
                    data: {
                        token: 'JWT ' + token,
                        user: user
                    }
                });
            }

            return userNotFound(res);
        });
    });
};

// Convenience function for user not found
function userNotFound(res) {
    // Unauthorized
    res.status(401);
    res.send({
        success: false,
        error: 'UserNotFound'
    });
}