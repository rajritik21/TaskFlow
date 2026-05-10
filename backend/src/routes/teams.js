const router = require('express').Router();
const teamController = require('../controllers/teamController');
const auth = require('../middleware/auth');

router.use(auth);

router.route('/')
    .post(teamController.createTeam)
    .get(teamController.getTeams);

router.route('/:id')
    .get(teamController.getTeamById)
    .put(teamController.updateTeam)
    .delete(teamController.deleteTeam);

module.exports = router;
