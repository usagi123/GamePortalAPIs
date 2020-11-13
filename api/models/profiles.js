const mongoose = require('mongoose');

const profileSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    fullName: {type: String, required: true},
    recentLogin: {type: String, required: true},
    profileCoins: {type: Number, required: true},
    profileStar: {type: Number, required: true},
    gameId: [{type: String}],
});

module.exports = mongoose.model('Profile', profileSchema);