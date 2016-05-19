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
	router.delete('/items/:id', auth, items.delete);
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

			// Bad request
			res.status(401);
			res.json({
				success: false,
				error: "ValidationError",
				validationErrors: errorsArray
			});

			return;
		}
		
		// Heroku will let us write to the log, just by doing console.log
		console.log(err);
		
		// Unknown error
		res.status(500);
		res.json({
			success: false,
			error: "Unknown error"
		});
	});

}