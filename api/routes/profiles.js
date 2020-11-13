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
                        recentLogin: moment(doc.recentLogin).format('HH:mm:ss DD-MM-YYYY') + ' UTC+07:00',
                        profileCoins: doc.profileCoins,
                        profileStar: doc.profileStar,
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
                recentLogin: moment(req.body.recentLogin, 'HH:mm:ss DD-MM-YYYY Asia/Ho_Chi_Minh'),
                profileCoins: req.body.profileCoins,
                profileStar: req.body.profileStar,
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
                    recentLogin: moment(result.recentLogin).format('HH:mm:ss DD-MM-YYYY') + ' UTC+07:00',
                    profileCoins: result.profileCoins,
                    profileStar: result.profileStar,
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
        .select('_id fullName recentLogin profileCoin profileStar gameId')
        .exec()
        .then(doc => {
            console.log("From db", doc);
            res.status(200).json({
                profile: {
                    _id: doc._id,
                    fullName: doc.fullName,
                    recentLogin: moment(doc.recentLogin).format('HH:mm:ss DD-MM-YYYY') + ' UTC+07:00',
                    profileCoins: doc.profileCoins,
                    profileStar: doc.profileStar,
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