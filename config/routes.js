
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var home = require('../app/controllers/home');

var cookieParser = require('cookie-parser');
var csrf = require('csurf');
var bodyparser = require('body-parser');

// setup route middlewares
var csrfprotection = csrf({ cookie: true });
var parseForm = bodyparser.urlencoded({ extended: false });

/**
 * Expose
 */

module.exports = function (app, passport) {

  // parse cookies
  app.use(cookieParser());

  app.get('/', csrfprotection, home.index);
  app.post('/', home.index);
  app.get('/event', csrfprotection, home.event);
  app.get('/events', home.getevents);
  app.get('/event/:email', home.getevent);
  app.post('/event', parseForm, csrfprotection, home.addevent);
  app.delete('/event/:email', home.deleteevent);

  /**
   * Error handling
   */

  app.use(function (err, req, res, next) {
    // treat as 404
    if (err.message
      && (~err.message.indexOf('not found')
      || (~err.message.indexOf('Cast to ObjectId failed')))) {
      return next();
    }
    console.error(err.stack);
    // error page
    res.status(500).render('500', { error: err.stack });
  });

  // assume 404 since no middleware responded
  app.use(function (req, res, next) {
    res.status(404).render('404', {
      url: req.originalUrl,
      error: 'Not found'
    });
  });
};
