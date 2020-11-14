const mongoose = require('mongoose');

const profileSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    fullName: {type: String, required: true},
    recentLogin: {type: String, required: true}, //input format HH:mm:ss DD-MM-YYYY UTC +0 but keeps as unix time stamp in the system
    profileCoins: {type: Number, required: true},
    profileStars: {type: Number, required: true},
    gameId: [{type: mongoose.Schema.Types.ObjectId, ref: 'Game'}],
});

module.exports = mongoose.model('Profile', profileSchema);