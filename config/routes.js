const categories = require('../app/controllers/categories'),
      users      = require('../app/controllers/users'),
      items      = require('../app/controllers/items');

module.exports = function(router) {
	// Categories
	router.get('/categories', categories.index);

	// Users
	router.get('/users', users.index);
	router.post('/users', users.create);
	router.get('/users/:id', users.find);

	// Authentication
	app.post('/users/session', passport.authenticate('local', {
		failureRedirect: '/login',
		failureFlash: 'Invalid email or password.'
    }), users.session);

	// // Items
	router.get('/items', items.index);
	router.post('/items', items.create);
}