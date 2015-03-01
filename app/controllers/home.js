
/*!
 * Module dependencies.
 */
var smodel = require('../models/score');

exports.index = function (req, res) {
  res.render('home/index', {
    title: 'Safe Driver',
      csrfToken: req.csrfToken()
  });
};

exports.event = function (req, res) {
    return smodel.ScoreModel.find(function (err, scores) {
        console.log(err);

        res.render('home/event', {
            title: 'Post and event',
            csrfToken: req.csrfToken(),
            scores: JSON.stringify(scores)
        });
    });
};

exports.getevents = function (req, res) {
    return smodel.ScoreModel.find(function (err, scores) {
        if(err) {
            res.send({status: 'failure', message: 'error: loading score from mongo'})
        } else {
            res.send({status: 'success', events: JSON.stringify(scores)})
        }
    });
};

exports.getevent = function (req, res) {
    if(req.params.email) {
        smodel.ScoreModel.find({email: req.params.email}, function(err, scores) {
            if(err) {
                res.send({status: 'failure', message: 'error: loading score from mongo'})
            } else {
                res.send({status: 'success', events: JSON.stringify(scores)})
            }
        });
    } else {
        res.send({status: 'failure', message: 'error: missing email id in request!'})
    }
};


exports.addevent = function (req, res) {
    var score = new smodel.ScoreModel({
        email: req.body.email,
        lat: req.body.lat,
        long: req.body.long,
        speed: req.body.speed
    });
    score.save(function(err) {
        if(err) {
            res.send({status: 'failed'});
        } else {
            res.send({status: 'success'});
        }
    });
};

exports.deleteevent = function (req, res) {
    if(req.params.email) {
        smodel.ScoreModel.find({email: req.params.email}).remove(function(err, scores) {
            if(err) {
                res.send({status: 'failure', message: 'error: delete score from mongo'})
            } else {
                res.send({status: 'success'})
            }
        });
    } else {
        res.send({status: 'failure', message: 'error: missing email id in request!'})
    }
};
