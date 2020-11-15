const mongoose = require('mongoose');
const moment = require('moment');

const Event = require('../models/events');
const Game = require('../models/games');

exports.events_get_all = (req, res, next) => {
    Event
        .find()
        .populate('gameId', '_id title')
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
};

exports.event_create = (req, res, next) => {
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
                eventStart: moment(req.body.eventStart, 'HH:mm:ss DD-MM-YYYY').unix(),
                eventEnd: moment(req.body.eventEnd, 'HH:mm:ss DD-MM-YYYY').unix(),
                starReward: req.body.starReward,
                gameId: req.body.gameId,
            })
            return event
                .save()
        })
        .then(result => {
            // console.log(result);
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
};

//API to know all the game information and upcoming events
exports.events_get_all_by_gameId = (req, res, next) => {
    const id = req.params.gameId;
    const currentTime = moment().unix();
    // console.log(currentTime);
    // console.log(moment.unix(currentTime).format('HH:mm:ss DD-MM-YYYY'));
    Game.findById(id)
        .then(game => {
            if(!game) {
                return res.status(404).json({
                    message: "GameId not found"
                });
            }
            Event
                //logic (currentT <= eventStart OR (eventStart <= currentT AND currentT <= eventEnd))
                .find({
                    $and: [
                        {gameId: id},
                        //currentT <= eventStart OR (eventStart <= currentT AND currentT <= eventEnd)
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
        })
};

exports.event_get_by_Id = (req, res, next) => {
    const id = req.params.eventId;
    Event
        .findById(id)
        .populate('gameId', '-__v')
        .exec()
        .then(doc => {
            // console.log(doc);
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
};

exports.event_update_by_Id = (req, res, next) => {
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
};

exports.event_delete_by_Id = (req, res, next) => {
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
};
