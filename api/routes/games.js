const express = require('express');
const router = express();
const mongoose = require('mongoose');

const Game = require('../models/games');

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
                        firstLoginBonusCoin: doc.firstLoginBonusCoin,
                        firstLoginBonusStar: doc.firstLoginBonusStar,
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
    const game = new Game({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        firstLoginBonusCoin: req.body.firstLoginBonusCoin,
        firstLoginBonusStar: req.body.firstLoginBonusStar,
    })
    game
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Product created successfully",
                createdGame: {
                    _id: result._id,
                    title: result.title,
                    firstLoginBonusCoin: result.firstLoginBonusCoin,
                    firstLoginBonusStar: result.firstLoginBonusStar,
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

router.get('/:gameId', (req, res, next) => {
    const id = req.params.gameId;
    Game
        .findById(id)
        .select('_id title firstLoginBonusCoin firstLoginBonusStar')
        .exec()
        .then(doc => {
            console.log("From db", doc);
            res.status(200).json({
                game: {
                    _id: doc._id,
                    title: doc.title,
                    firstLoginBonusCoin: doc.firstLoginBonusCoin,
                    firstLoginBonusStar: doc.firstLoginBonusStar,
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

router.patch('/:gameId', (req, res, next) => {
    const id = req.params.gameId;
    const updateOps = {};
    for (const ops  of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Game
        .update(
            {_id: id},
            {$set: updateOps}
        )
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Game info updated",
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
});

router.delete('/:gameId', (req, res, next) => {
    const id = req.params.gameId;
    Game
        .deleteOne(
            {_id: id}
        )
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Game deleted"
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