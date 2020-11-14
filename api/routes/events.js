const express = require('express');
const router = express();
const mongoose = require('mongoose');
const moment = require('moment');

const Event = require('../models/events');
const Game = require('../models/games');

router.get('/', (req, res, next) => {
    Event
        .find()
        .populate('gameId')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                games: docs.map(doc => {
                    return {
                        _id: doc._id,
                        title: doc.title,
                        eventStart: moment.unix(doc.eventStart).format('HH:mm:ss DD-MM-YYYY') + ' UTC+07:00',
                        eventEnd: moment.unix(doc.eventEnd).format('HH:mm:ss DD-MM-YYYY') + ' UTC+07:00',
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
                eventStart: moment(req.body.eventStart, 'HH:mm:ss DD-MM-YYYY Asia/Ho_Chi_Minh').unix(),
                eventEnd: moment(req.body.eventEnd, 'HH:mm:ss DD-MM-YYYY Asia/Ho_Chi_Minh').unix(),
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
                    eventStart: moment.unix(result.eventStart).format('HH:mm:ss DD-MM-YYYY') + ' UTC+07:00',
                    eventEnd: moment.unix(result.eventEnd).format('HH:mm:ss DD-MM-YYYY') + ' UTC+07:00',
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

//API to know all the game information and upcoming events
//WIP - https://stackoverflow.com/questions/26475013/date-comparison-with-mongoose/26475576
// https://stackoverflow.com/questions/37571722/mongoose-date-comparison
router.get('/onegameallevents/:gameId', (req, res, next) => {
    const id = req.params.gameId;
    const currentTime = moment('07:00:00 10-11-2020', 'HH:mm:ss DD-MM-YYYY Asia/Ho_Chi_Minh').unix();
    console.log(currentTime);
    console.log(moment.unix(currentTime).format('HH:mm:ss DD-MM-YYYY'));
    Game.findById(id)
        .then(game => {
            if(!game) {
                return res.status(404).json({
                    message: "GameId not found"
                });
            }
            Event
                //logic (currentT <= eventStart OR (eventStart <= currentT AND currentT <= eventEnd))
                // {eventStart: {$gte: currentTime}} OR [{eventStart: {$lte: currentTime}}, {eventEnd: {$gte: currentTime}}]
                //{$or:[{eventStart: {$gte: currentTime}},[{eventStart: {$lte: currentTime}}, {eventEnd: {$gte: currentTime}}]]}
                .find({
                    $and: [
                        {gameId: id},
                        //currentT <= eventStart OR (eventStart <= currentT AND currentT <= eventEnd
                        {$or: [
                            {eventStart: {$gte: currentTime}},
                            //(eventStart <= currentT AND currentT <= eventEnd
                            {$and: [
                                {eventStart: {$lte: currentTime}},
                                {eventEnd: {$gte: currentTime}}
                            ]}
                        ]},
                    ]
                })
                .populate('gameId', '_id title firstLoginBonusCoin firstLoginBonusStar')
                .exec()
                .then(docs => {
                    const response = {
                        count: docs.length,
                        events: docs.map(doc => {
                            return {
                                _id: doc._id,
                                title: doc.title,
                                eventStart: moment.unix(doc.eventStart).format('HH:mm:ss DD-MM-YYYY') + ' UTC+07:00',
                                eventEnd: moment.unix(doc.eventEnd).format('HH:mm:ss DD-MM-YYYY') + ' UTC+07:00',
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
                    eventStart: moment.unix(doc.eventStart).format('HH:mm:ss DD-MM-YYYY') + ' UTC+07:00',
                    eventEnd: moment.unix(doc.eventEnd).format('HH:mm:ss DD-MM-YYYY') + ' UTC+07:00',
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


module.exports = router;