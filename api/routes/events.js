const express = require('express');
const router = express();
const mongoose = require('mongoose');

const Event = require('../models/events');
const Game = require('../models/games');

router.get('/', (req, res, next) => {
    Event
        .find()
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                games: docs.map(doc => {
                    return {
                        _id: doc._id,
                        title: doc.title,
                        eventStart: doc.eventStart,
                        eventEnd: doc.eventEnd,
                        starReward: doc.starReward,
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
            const event = new Event({
                _id: new mongoose.Types.ObjectId(),
                title: req.body.title,
                eventStart: req.body.eventStart,
                eventEnd: req.body.eventEnd,
                starReward: req.body.starReward,
                gameId: req.body.gameId,
            })
            return event
                .save()
        })
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Event created successfully",
                createdEvent: {
                    _id: result._id,
                    title: result.title,
                    eventStart: result.eventStart,
                    eventEnd: result.eventEnd,
                    starReward: result.starReward,
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

router.get('/:eventId', (req, res, next) => {
    const id = req.params.eventId;
    Event
        .findById(id)
        .select('_id title eventStart eventEnd starReward gameId')
        .exec()
        .then(doc => {
            console.log("From db", doc);
            res.status(200).json({
                event: {
                    _id: doc._id,
                    title: doc.title,
                    eventStart: doc.eventStart,
                    eventEnd: doc.eventEnd,
                    starReward: doc.starReward,
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

router.patch('/:eventId', (req, res, next) => {
    const id = req.params.eventId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Event
        .updateOne(
            {_id: id},
            {$set: updateOps}
        )
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Event info updated",
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
});

router.delete('/:eventId', (req, res, next) => {
    const id = req.params.eventId;
    Event
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


module.exports = router