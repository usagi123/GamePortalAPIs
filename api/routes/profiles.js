const express = require('express');
const router = express();
const mongoose = require('mongoose');
const moment = require('moment');

const Profile = require('../models/profiles');
const Game = require('../models/games');

router.get('/', (req, res, next) => {
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
});

router.post('/', (req, res, next) => {
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
            console.log(result);
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
});

router.get('/:profileId', (req, res, next) => {
    const id = req.params.profileId;
    Profile
        .findById(id)
        .select('_id fullName recentLogin profileCoin profileStars gameId')
        .exec()
        .then(doc => {
            console.log("From db", doc);
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
});

//Custom API to GET details of a specific PLAYER for a specific GAME
router.get('/profileforspecificgame/:gameId/:profileId', (req, res, next) => {
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
                        .select('_id fullName recentLogin profileCoins profileStars gameId')
                        .exec()
                        .then(doc => {
                            console.log(doc)
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
});

//Custom API to PATCH details of a specific PLAYER for a specific GAME
router.patch('/profileforspecificgame/:gameId/:profileId', (req, res, next) => {
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
                        updateOps[ops.propName] = ops.value;
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
});

router.patch('/:profileId', (req, res, next) => {
    const id = req.params.profileId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
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
});

router.delete('/:profileId', (req, res, next) => {
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
});


module.exports = router;