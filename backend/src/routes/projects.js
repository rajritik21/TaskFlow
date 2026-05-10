const router = require('express').Router();
const projectController = require('../controllers/projectController');
const auth = require('../middleware/auth');

router.use(auth);

router.route('/')
    .post(projectController.createProject)
    .get(projectController.getProjects);

router.route('/:id')
    .get(projectController.getProjectById)
    .put(projectController.updateProject)
    .delete(projectController.deleteProject);

module.exports = router;
