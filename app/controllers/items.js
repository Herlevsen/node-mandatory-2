/**
 * Dependencies
 */
const mongoose = require('mongoose');
const wrap = require('co-express');
const Item = mongoose.model('Item');
const User = mongoose.model('User');
const Category = mongoose.model('Category');

exports.index = wrap(function* (req, res, next) {

	// CategoryId
	const categoryId = req.query.categoryId || null;

	// Pagination
	const page = parseInt(req.query.page) || 1;
	const limit = parseInt(req.query.limit) || 100;
	const skip = (page - 1) * limit;
	const orderQuery = categoryId ? { category: categoryId } : {};

	// Latitude / Longitude / Radius
	const lat    = !isNaN(req.query.lat) ? parseFloat(req.query.lat) : null;
	const long   = !isNaN(req.query.long) ? parseFloat(req.query.long) : null;
	const radius = !isNaN(req.query.radius) ? (parseInt(req.query.radius) / 6371) : 100 / 6371;
	const isLocationSearch = lat !== null && long !== null;

	// Prepare lists
	var userIds = {};
	var categoryIds = {};

	// If a category is chosen, add it to the query
	var queryOptions = {};
	if (categoryId != null) {
		queryOptions.category = mongoose.Types.ObjectId(categoryId)
	}

	// Create a query
	const query = Item
		.find(queryOptions)
		.sort( { createdAt: "desc" } );

	if(isLocationSearch) {
		query.where('address.location').near({
			center: [long, lat],
			spherical: true,
			maxDistance: radius
		});
	} else {
		query.limit(limit).skip(skip);
	}

	// Get items
	const items = yield query.exec();

	// Get user and category ids
	const l = items.length;
	for (var i = 0; i < l; i++) {
		userIds[items[i].owner] = true;
		categoryIds[items[i].category] = true
	}

	// Get users
	const users = yield User.where('_id')
		.in(Object.keys(userIds))
		.exec();

	// Get categories
	const categories = yield Category.where('_id')
		.in(Object.keys(categoryIds))
		.exec();

	res.json({
		success: true,
		data: items,
		relationships: {
			users: users,
			categories: categories
		}
	});

});

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
			location: {
				type: 'Point',
				coordinates: req.body.address.coordinates
			}
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
				data: item,
				relationships: {
					category: category
				}
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