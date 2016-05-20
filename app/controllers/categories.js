/**
 * Dependencies
 */
const Category = require('mongoose').model('Category');

exports.index = function(req, res, next) {

	Category.find()
		.select('-__v')
		.sort({name: 'asc'})
		.exec(function(err, categories) {
			if(err) {
				return next(err);
			}

			res.json({
				success: true,
				data: categories
			});
		});

};

exports.create = function(req, res, next) {

	const user = req.user;

	if( !user.isAdmin() ) {
		return next(new Error("Unauthorized"));
	}

	const category = new Category({
		title: req.body.title,
		image: "https://docs.joomla.org/images/0/02/Joomla-flat-logo-en.png"
	});

	category.save(function (err) {
		if (err) {
			return next(err)
		}

		// saved!
		res.json({
			success: true,
			data: category
		});
	});
};