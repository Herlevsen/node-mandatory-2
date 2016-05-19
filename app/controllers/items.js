/**
 * Dependencies
 */
const mongoose = require('mongoose');

const Item = mongoose.model('Item');
const User = mongoose.model('User');

exports.index = function(req, res, next) {
	const page  = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const skip  = (page - 1) * limit;

    const userIds = [];

	Item.find()
    .select('-__v')
    .limit(limit)
    .skip(skip)
    .sort({name: 'asc'})
    .exec(function(err, items) {
        if(err) {
            return next(err);
        }

        const l = items.length;
        for(var i = 0; i < l; i++) {
            userIds.push(items[i].owner);
        }

        User.find()
        .where('_id')
        .in(userIds)
        .exec(function(err, users) {
            if(err) {
                return next(err);
            }

            res.json({
                data: items,
                relationships: {
                    users: users
                }
            });
        });
    });
}

exports.create = function(req, res, next) {

    var address = {
        address: req.body.address.address,
        cityName: req.body.address.cityName,
        postalCode: parseInt(req.body.address.postalCode),
        latitude: parseFloat(req.body.address.latitude),
        longitude: parseFloat(req.body.address.longitude)
    };

    var item = new Item({
        title: req.body.title,
        description: req.body.description,
        owner: req.user._id,
        address: address

    });

    // For the moment we hardcode an image
    item.images.push("avatar.png");

    item.save(function (err) {
        if (err) {
            return next(err);
        }
        // saved!
        res.json({
            status: "created",
            data: item
        });
    });
}

exports.find = function(req, res) {
	Item.findOne(req.params.id).select('-__v').exec(function(err, item) {
        if(err) {
            return next(err);
        }

        if(item === null) {
            return res.json({
                success: false,
                error: "NotFound"
            });
        }
        res.json({
            data: item
        });
    });
}

exports.delete = function(req, res, next) {
    Item.findOne(req.params.id).select('-__v').exec(function(err, item) {
        if(err) {
            return next(err);
        }

        if(item === null) {
            return res.json({
                success: false
            });
        }

        item.delete(function () {
            res.json({
                success: true
            });
        });

    });
}