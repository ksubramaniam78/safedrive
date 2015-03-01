
/**
 * Module dependencies
 */

var fs = require('fs');
var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var config = require('./config/config');

//var csrf = express.csrf();
var app = express();


var conditionalCSRF = function (req, res, next) {
    //compute needCSRF here as appropriate based on req.path or whatever
    if (needCSRF) {
        csrf(req, res, next);
    } else {
        next();
    }
};
//app.use(conditionalCSRF);

var port = process.env.PORT || 3000;

// Connect to mongodb
var connect = function () {
  var options = { server: { socketOptions: { keepAlive: 1 } } };
    console.log(process.env.MONGO_URL);
    console.log(config.db);
  mongoose.connect(config.db, options);
};
connect();

mongoose.connection.on('error', console.log);
mongoose.connection.on('disconnected', connect);
mongoose.connection.on("open", function(ref) {
    console.log("Connected to mongo server.");
});

// Bootstrap models
fs.readdirSync(__dirname + '/app/models').forEach(function (file) {
  if (~file.indexOf('.js')) require(__dirname + '/app/models/' + file);
});

// Bootstrap passport config
require('./config/passport')(passport, config);

// Bootstrap application settings
require('./config/express')(app, passport);

// Bootstrap routes
require('./config/routes')(app, passport);

app.listen(port);
console.log('Express app started on port ' + port);
