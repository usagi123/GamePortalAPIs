const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: {type: String, required: true},
    eventStart: {type: Date, required: true}, //input format HH:mm:ss DD-MM-YYYY UTC +7
    eventEnd: {type: Date, required: true}, //input format HH:mm:ss DD-MM-YYYY UTC +7
    starReward: {type: Number, required: true},
    gameId: {type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true},
});

module.exports = mongoose.model('Event', eventSchema);