const categories = require('../app/controllers/categories'),
      users      = require('../app/controllers/users'),
      items      = require('../app/controllers/items');

module.exports = function(app, router, passport) {

	const auth = passport.authenticate('jwt', {session: false});

	// Categories
	router.get('/categories', categories.index);
	router.post('/categories', auth, categories.create);

	// Authentication
	router.post('/authenticate', users.authenticate);

	// Items
	router.get('/items', items.index);
	router.get('/items/:id', items.find);
	router.post('/items', auth, items.create);

	// Users
	router.post('/users', users.create);
	router.get('/users/:id', users.find);

	// Add routes to express instance
	app.use('/api/v1', router);

	// Error handling
	app.use(function(err, req, res, next) {

		if (err.name == 'ValidationError') {
			var errorsArray = [];

			for (field in err.errors) {
				errorsArray.push({
					field: field,
					text: err.errors[field].message
				});
			}

			res.json({
				error: "ValidationError",
				validationErrors: errorsArray
			});

		} else {
			// A general error (db, crypto, etc…)
			res.json({
				error: err.message
			});
		}
	});

}