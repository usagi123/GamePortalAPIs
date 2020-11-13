const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: {type: String, required: true},
    eventStart: {type: String, required: true},
    eventEnd: {type: String, required: true},
    starReward: {type: String, required: true},
    gameId: {type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true},
});

module.exports = mongoose.model('Event', eventSchema);