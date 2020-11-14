const mongoose = require('mongoose');

const profileSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    fullName: {type: String, required: true},
    recentLogin: {type: Date, required: true}, //input format HH:mm:ss DD-MM-YYYY UTC +7 but keeps as unix time stamp
    profileCoins: {type: Number, required: true},
    profileStar: {type: Number, required: true},
    gameId: [{type: mongoose.Schema.Types.ObjectId, ref: 'Game'}],
});

module.exports = mongoose.model('Profile', profileSchema);