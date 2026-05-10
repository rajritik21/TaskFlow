const router = require('express').Router();
const taskController = require('../controllers/taskController');
const auth = require('../middleware/auth');

router.use(auth);

router.route('/')
    .post(taskController.createTask)
    .get(taskController.getTasks);

router.route('/:id')
    .get(taskController.getTaskById)
    .put(taskController.updateTask)
    .delete(taskController.deleteTask);

module.exports = router;