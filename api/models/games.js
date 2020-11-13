const mongoose = require('mongoose');

const gameSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: {type: String, required: true},
    firstLoginBonusCoin: {type: Number, required: true},
    firstLoginBonusStar: {type: Number, required: true}
});

module.exports = mongoose.model('Game', gameSchema);