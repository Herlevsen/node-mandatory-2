/**
 * Dependencies
 */
const fs       = require('fs');
const express  = require('express');
const join     = require('path').join;
const mongoose = require('mongoose');

/**
 * Bootstrap application
 */
const port   = process.env.NODE_PORT || 3000,
      router = express.Router();
      app    = express(),
      models = join(__dirname, 'app/models');

// Setup models
fs.readdirSync(models)
    .filter(file => ~file.search(/^[^\.].*\.js$/))
    .forEach(file => require(join(models, file)));
        
// Configure express
require('./config/express.js')(app);

// Setup routes
require('./config/routes')(router);

// Use the router and prefix it
app.use('/api/v1', router);

connect()
.on('error', console.log)
.on('disconnected', connect)
.once('open', function() {
    // And now we wait...
    app.listen(3000);
});

function connect () {
    var options = { server: { socketOptions: { keepAlive: 1 } } };
    return mongoose.connect('mongodb://localhost/gratisting', options).connection;
}