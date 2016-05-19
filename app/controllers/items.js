/**
 * Dependencies
 */
const mongoose = require('mongoose');

const Item = mongoose.model('Item');
const User = mongoose.model('User');
const Category = mongoose.model('Category');

exports.index = function (req, res, next) {
	// Pagination
	const page = parseInt(req.query.page) || 1;
	const limit = parseInt(req.query.limit) || 100;
	const skip = (page - 1) * limit;

	// Latitude / Longitude / Radius
	const lat    = !isNaN(req.query.lat) ? parseFloat(req.query.lat) : null;
	const long   = !isNaN(req.query.long) ? parseFloat(req.query.long) : null;
	const radius = !isNaN(req.query.radius) ? (parseInt(req.query.radius) / 6371) : null;

	console.log(radius);

	const userIds = [];

	var queryOptions = {
		maxDistance: radius,
		distanceMultiplier: 6371, // tell mongo how many radians go into one kilometer.
		spherical: true,
		limit: 60
	};

	Item.geoNear([long, lat], queryOptions, function (err, items) {
		if (err) {
			return next(err);
		}

		const l = items.length;
		for (var i = 0; i < l; i++) {
			userIds.push(items[i].owner);
		}

		User.find()
			.where('_id')
			.in(userIds)
			.exec(function (err, users) {
				if (err) {
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
	// .find({
	// 	address: {
	// 		coordinates: {
	// 			$near: [long, lat],
	// 			$maxDistance: maxDistance
	// 		}
	// 	}
	// })
	// .select('-__v')
	// .limit(limit)
	// .skip(skip)
	// .sort({name: 'asc'})
	// .exec(function (err, items) {
	// 	if (err) {
	// 		return next(err);
	// 	}
	//
	// 	const l = items.length;
	// 	for (var i = 0; i < l; i++) {
	// 		userIds.push(items[i].owner);
	// 	}
	//
	// 	User.find()
	// 		.where('_id')
	// 		.in(userIds)
	// 		.exec(function (err, users) {
	// 			if (err) {
	// 				return next(err);
	// 			}
	//
	// 			res.json({
	// 				data: items,
	// 				relationships: {
	// 					users: users
	// 				}
	// 			});
	// 		});
	// });
}

exports.create = function(req, res, next) {

	// find requested category
	Category.findById(req.body.categoryId, function (err, category) {

		if (err) {
			return next(err);
		}

		if(!category) {
			return res.json({
				success: false,
				error: "NotFound"
			});
		}

		// found a category
		const address = {
			address: req.body.address.address,
			cityName: req.body.address.cityName,
			postalCode: parseInt(req.body.address.postalCode),
			coordinates: req.body.address.coordinates
		};

		var item = new Item({
			title: req.body.title,
			description: req.body.description,
			owner: req.user._id,
			address: address,
			category: category._id

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

	});
};

exports.find = function(req, res, next) {
	Item.findById(req.params.id).select('-__v').exec(function(err, item) {
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
			status: "success",
            data: item
        });
    });
};

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
};