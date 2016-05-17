/**
 * Dependencies
 */
const bodyParser = require('body-parser');
const express    = require('express');

module.exports = function(app) {
	// Serve static files from express
  	app.use(express.static('public'));

  	// Parse request body as json
	app.use(bodyParser.json());
}