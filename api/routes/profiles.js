const express = require('express');
const router = express();

const ProfilesController = require('../controllers/profiles');

router.get('/', ProfilesController.profiles_get_all);

router.post('/', ProfilesController.profile_create);

router.get('/:profileId', ProfilesController.profile_get_by_Id);

//API to get a player’s information in a specific game
router.get('/profileforspecificgame/:gameId/:profileId', ProfilesController.profile_get_by_gameId);

//API to update a player’s information in a specific game
router.patch('/profileforspecificgame/:gameId/:profileId', ProfilesController.profile_update_by_gameId);

//API to get rewards from players when the event completes
router.patch('/getEventRewards/:profileId/:eventId', ProfilesController.profile_get_event_reward);

router.patch('/:profileId', ProfilesController.profile_update_by_Id);

router.delete('/:profileId', ProfilesController.profile_delete_by_Id);


module.exports = router;