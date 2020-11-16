const mongoose = require('mongoose');
const moment = require('moment');

const Profile = require('../models/profiles');
const Game = require('../models/games');
const Event = require('../models/events');

exports.profiles_get_all = (req, res, next) => {
    Profile
        .find()
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                profiles: docs.map(doc => {
                    return {
                        _id: doc._id,
                        fullName: doc.fullName,
                        recentLogin: doc.recentLogin,
                        profileCoins: doc.profileCoins,
                        profileStars: doc.profileStars,
                        gameId: doc.gameId,
                    }
                })
            }
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
};

exports.profile_create = (req, res, next) => {
    Game.findById(req.body.gameId)
        .then(game => {
            if(!game) {
                return res.status(404).json({
                    message: "GameId not found"
                });
            }
            const profile = new Profile({
                _id: new mongoose.Types.ObjectId(),
                fullName: req.body.fullName,
                recentLogin: moment(req.body.recentLogin, 'HH:mm:ss DD-MM-YYYY').unix(),
                profileCoins: req.body.profileCoins,
                profileStars: req.body.profileStars,
                gameId: req.body.gameId,
            })
            return profile
                .save()
        })
        .then(result => {
            // console.log(result);
            res.status(201).json({
                message: "Profile created successfully",
                createdProfile: {
                    _id: result._id,
                    fullName: result.fullName,
                    recentLogin: result.recentLogin,
                    profileCoins: result.profileCoins,
                    profileStars: result.profileStars,
                    gameId: result.gameId,
                }
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err,
            })
        })
};

exports.profile_get_by_Id = (req, res, next) => {
    const id = req.params.profileId;
    Profile
        .findById(id)
        .select('_id fullName recentLogin profileCoin profileStars gameId') //('-__v')
        .exec()
        .then(doc => {
            // console.log(doc);
            res.status(200).json({
                profile: {
                    _id: doc._id,
                    fullName: doc.fullName,
                    recentLogin: doc.recentLogin,
                    profileCoins: doc.profileCoins,
                    profileStars: doc.profileStars,
                    gameId: doc.gameId,
                }
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
};

//API to get a player’s information in a specific game
exports.profile_get_by_gameId = (req, res, next) => {
    const GameId = req.params.gameId;
    const ProfileId = req.params.profileId;
    Game.findById(GameId)
        .then(game => {
            if(!game) {
                return res.status(404).json({
                    message: "GameId not found"
                })
            }
            Profile
                .findById(ProfileId)
                .then(profile => {
                    if(!profile) {
                        return res.status(404).json({
                            message: "ProfileId not found"
                        })
                    }
                    Profile
                        .find({gameId: GameId, _id: ProfileId})
                        .select('-__v')
                        .exec()
                        .then(doc => {
                            // console.log(doc)
                            res.status(200).json({doc})
                        })
                        .catch(err => {
                            res.status(500).json({
                                error: err
                            })
                        })
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error: err,
                    })
                })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err,
            })
        })
};

//API to update a player’s information in a specific game
exports.profile_update_by_gameId = (req, res, next) => {
    const GameId = req.params.gameId;
    const ProfileId = req.params.profileId;
    const updateOps = {};
    Game.findById(GameId)
        .then(game => {
            if(!game) {
                return res.status(404).json({
                    message: "GameId not found",
                })
            }
            Profile
                .findById(ProfileId)
                .then(profile => {
                    if(!profile) {
                        return res.status(404).json({
                            message: "ProfileId not found",
                        })
                    }
                    for (const ops of req.body) {
                        if(ops.propName === 'recentLogin') {
                            updateOps[ops.propName] = moment(ops.value, 'HH:mm:ss DD-MM-YYYY').unix()
                        } else {
                            updateOps[ops.propName] = ops.value;
                        }
                    }
                    Profile
                        .updateOne(
                            {_id: ProfileId},
                            {$set: updateOps}
                        )
                        .exec()
                        .then(result =>{
                            res.status(200).json({
                                message: "Profile info updated",
                            })
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({
                                error: err
                            })
                        })
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error: err
                    })
                })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
};

//API to get rewards from players when the event completes
exports.profile_get_event_reward = (req, res, next) => {
    const profileId = req.params.profileId;
    const eventId = req.params.eventId;
    var profileCurrentStars = 0;
    var profileUpdatedStars = 0;
    var eventRewardStars = 0;
    Event
        .findById(eventId)
        .exec()
        .then(doc => {
            eventRewardStars = doc.starReward;
            Profile
                .findById(profileId)
                .exec()
                .then(doc => {
                    profileCurrentStars = doc.profileStars;
                    profileUpdatedStars = profileCurrentStars + eventRewardStars;
                    Profile
                        .updateOne(
                            {_id: profileId},
                            {$set: {profileStars: profileUpdatedStars}}
                        )
                        .exec()
                        .then(result => {
                            res.status(200).json({
                                message: "Added event reward for this profile",
                            })
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({
                                error: err
                            })
                        })
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error: err
                    })
                })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
};

exports.profile_update_by_Id = (req, res, next) => {
    const id = req.params.profileId;
    const updateOps = {};
    for (const ops of req.body) {
        if(ops.propName === 'recentLogin') {
            updateOps[ops.propName] = moment(ops.value, 'HH:mm:ss DD-MM-YYYY').unix()
        } else {
            updateOps[ops.propName] = ops.value;
        }
    }
    Profile
        .updateOne(
            {_id: id},
            {$set: updateOps}
        )
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Profile info updated",
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
}

exports.profile_delete_by_Id = (req, res, next) => {
    const id = req.params.profileId;
    Profile
        .deleteOne(
            {_id: id}
        )
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Event deleted"
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
};