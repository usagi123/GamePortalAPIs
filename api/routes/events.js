const express = require('express');
const router = express();
const mongoose = require('mongoose');

const Event = require('../models/games');

router.get('/', (req, res, next) => {
    Game
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

module.exports = router