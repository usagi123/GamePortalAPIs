const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: {type: String, required: true},
    eventStart: {type: String, required: true}, //input format HH:mm:ss DD-MM-YYYY UTC +0 but keeps as unix time stamp
    eventEnd: {type: String, required: true}, //input format HH:mm:ss DD-MM-YYYY UTC +0 but keeps as unix time stamp
    starReward: {type: Number, required: true},
    gameId: {type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true},
});

module.exports = mongoose.model('Event', eventSchema);