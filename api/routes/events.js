const express = require('express');
const router = express();

const EventsController = require('../controllers/events');

router.get('/', EventsController.events_get_all);

router.post('/', EventsController.event_create);

//API to know all the game information and upcoming events
router.get('/onegameallevents/:gameId', EventsController.events_get_all_by_gameId);

router.get('/:eventId', EventsController.event_get_by_Id);

router.patch('/:eventId', EventsController.event_update_by_Id);

router.delete('/:eventId', EventsController.event_delete_by_Id);


module.exports = router;