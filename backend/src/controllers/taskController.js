const Task = require('../models/Task');
const Project = require('../models/Project');

exports.createTask = async (req, res) => {
    try {
        const task = new Task({
            ...req.body,
            createdBy: req.user.id
        });
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getTasks = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', status, priority, projectId, assignedTo, startDate, endDate } = req.query;
        const query = { createdBy: req.user.id };
        
        if (search) query.title = { $regex: search, $options: 'i' };
        if (status) query.status = status;
        if (priority) query.priority = priority;
        if (projectId) query.projectId = projectId;
        if (assignedTo) query.assignedTo = assignedTo;
        
        // Date range filtering
        if (startDate || endDate) {
            query.dueDate = {};
            if (startDate) query.dueDate.$gte = new Date(startDate);
            if (endDate) query.dueDate.$lte = new Date(endDate);
        }

        // Also fetch tasks assigned to the user
        const assignedQuery = { assignedTo: req.user.id };
        if (search) assignedQuery.title = { $regex: search, $options: 'i' };
        if (status) assignedQuery.status = status;
        if (priority) assignedQuery.priority = priority;
        if (projectId) assignedQuery.projectId = projectId;
        
        if (startDate || endDate) {
            assignedQuery.dueDate = {};
            if (startDate) assignedQuery.dueDate.$gte = new Date(startDate);
            if (endDate) assignedQuery.dueDate.$lte = new Date(endDate);
        }

        const finalQuery = {
            $or: [query, assignedQuery]
        };

        const tasks = await Task.find(finalQuery)
            .populate('projectId', 'name')
            .populate('assignedTo', 'username email')
            .populate('createdBy', 'username email')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await Task.countDocuments(finalQuery);

        res.json({
            tasks,
            totalPages: Math.ceil(count / limit),
            currentPage: Number(page)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getTaskById = async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            $or: [{ createdBy: req.user.id }, { assignedTo: req.user.id }]
        }).populate('projectId', 'name').populate('assignedTo', 'username email');
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, $or: [{ createdBy: req.user.id }, { assignedTo: req.user.id }] },
            req.body,
            { new: true, runValidators: true }
        ).populate('projectId', 'name').populate('assignedTo', 'username email');
        if (!task) return res.status(404).json({ message: 'Task not found or unauthorized' });
        res.json(task);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, createdBy: req.user.id });
        if (!task) return res.status(404).json({ message: 'Task not found or unauthorized' });
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
