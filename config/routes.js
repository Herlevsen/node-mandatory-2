const categories = require('../app/controllers/categories'),
      users      = require('../app/controllers/users'),
      items      = require('../app/controllers/items');

module.exports = function(router, passport) {

	const auth = passport.authenticate('jwt', {session: false});
	
	// Authentication
	router.post('/authenticate', users.authenticate);

	// Categories
	router.get('/categories', categories.index);
	
	// Items
	router.get('/items', items.index);
	router.get('/items/:id', items.find);
	router.post('/items', auth, items.create);

	// Users
	router.post('/users', users.create);
	router.get('/users/:id', users.find);

}