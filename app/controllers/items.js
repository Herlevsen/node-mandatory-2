/**
 * Dependencies
 */
const mongoose = require('mongoose');

const Item = mongoose.model('Item');
const User = mongoose.model('User');
const Category = mongoose.model('Category');

exports.index = function (req, res, next) {

	// CategoryId
	const categoryId = req.query.categoryId || null;

	// Latitude / Longitude / Radius
	const lat    = !isNaN(req.query.lat) ? parseFloat(req.query.lat) : null;
	const long   = !isNaN(req.query.long) ? parseFloat(req.query.long) : null;
	const radius = !isNaN(req.query.radius) ? (parseInt(req.query.radius) / 6371) : null;
	const isLocationSearch = lat !== null && long !== null && radius != null;

	if( isLocationSearch) {

		const userIds = [];

		var locationQuery = {
			maxDistance: radius,
			distanceMultiplier: 6371, // tell mongo how many radians go into one kilometer.
			spherical: true,
			limit: 60
		};

		// If a category is chosen, add it to the query
		if (categoryId != null) {
			locationQuery.query = {
				category: mongoose.Types.ObjectId(categoryId)
			}
		}

		Item.geoNear([long, lat], locationQuery, function (err, items) {
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
						success: true,
						data: items,
						relationships: {
							users: users
						}
					});
				});
		});

		return;
	}

	// Pagination
	const page = parseInt(req.query.page) || 1;
	const limit = parseInt(req.query.limit) || 100;
	const skip = (page - 1) * limit;

	const orderQuery = categoryId ? { category: categoryId } : {};

	Item.find(orderQuery).
		limit(limit).
		skip(skip).
		sort( { createdAt: "desc" } ).
		exec(function(err, items) {
			res.json({
				success: true,
				data: items
			});
	});
};

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
				success: true,
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
			res.status(404);
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
			// Not found
			res.status(404);
            return res.json({
                success: false,
				error: "ItemNotFound"
            });
        }

        item.delete(function () {
			// Successfull - not returning any content
			res.status(204);
            res.json({
                success: true
            });
        });

    });
};