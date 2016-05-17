/**
 * Dependencies
 */
const mongoose = require('mongoose');

const Item = mongoose.model('Item');

exports.index = function(req, res) {
	const page  = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const skip  = (page - 1) * limit;

	Item.find()
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
        owner: req.user,
        address: address

    });

    // For the moment we hardcode an image
    item.images.push("avatar.png");

    item.save(function (err) {
        if (err) {
            return handleError(err);
        }
        // saved!
    });



    res.json({
    	status: "created",
        data: item
    });
}

exports.find = function(req, res) {
	Item.findOne(req.params.id).select('-__v').exec(function(err, item) {
        if(err) {

        }

        res.json({
            data: item
        });
    });
}