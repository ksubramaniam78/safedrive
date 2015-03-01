/**
 * Created by ksubramaniam on 2/28/15.
 */

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var scoreSchema = new Schema({
    email: { type: String, required: true },
    lat: { type: String, required: true },
    long: { type: String, required: true},
    speed: { type: String, required: true},
    created: { type: Date, default: Date.now }
});

exports.ScoreModel = mongoose.model('Score', scoreSchema);