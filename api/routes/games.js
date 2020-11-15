const express = require('express');
const router = express();

const GamesController = require('../controllers/games');

router.get('/', GamesController.games_get_all);

router.post('/', GamesController.game_create);

router.get('/:gameId', GamesController.game_get_by_Id);

router.patch('/:gameId', GamesController.game_update_by_Id);

router.delete('/:gameId', GamesController.game_delete);


module.exports = router;