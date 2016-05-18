/**
 * Dependencies
 */
const fs       = require('fs');
const express  = require('express');
const join     = require('path').join;
const mongoose = require('mongoose');
const passport = require('passport');
const config   = require('./config');

/**
 * Bootstrap application
 */
const port   = process.env.NODE_PORT || 3000,
      router = express.Router();
      app    = express(),
      models = join(__dirname, 'app/models');

// Load mongoose models
fs.readdirSync(models)
    .filter(file => ~file.search(/^[^\.].*\.js$/))
    .forEach(file => require(join(models, file)));

// Configure passport, configure express, setup routes
require('./config/passport.js')(passport);
require('./config/express.js')(app);
require('./config/routes')(app, router, passport);

connect()
.on('error', console.log)
.on('disconnected', connect)
.once('open', function() {
    // And now we wait...
    app.listen(3000);
});

function connect () {
    var options = { server: { socketOptions: { keepAlive: 1 } } };
    return mongoose.connect(config.mongodb, options).connection;
}