const Project = require('../models/Project');
const Team = require('../models/Team');

exports.createProject = async (req, res) => {
    try {
        if (req.body.teamId) {
            const team = await Team.findById(req.body.teamId);
            if (!team || (!team.members.includes(req.user.id) && team.createdBy.toString() !== req.user.id)) {
                return res.status(403).json({ message: 'Not authorized to create project for this team' });
            }
        }
        const project = new Project({
            ...req.body,
            createdBy: req.user.id
        });
        await project.save();
        res.status(201).json(project);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getProjects = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', teamId } = req.query;
        let query = { createdBy: req.user.id };
        
        // If getting projects for a specific team, must be a member
        if (teamId) {
            const team = await Team.findById(teamId);
            if (team && (team.members.includes(req.user.id) || team.createdBy.toString() === req.user.id)) {
                query = { teamId };
            } else {
                return res.status(403).json({ message: 'Not authorized for this team' });
            }
        }

        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        const projects = await Project.find(query)
            .populate('teamId', 'name')
            .populate('createdBy', 'username email')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await Project.countDocuments(query);

        res.json({
            projects,
            totalPages: Math.ceil(count / limit),
            currentPage: Number(page)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate('teamId', 'name')
            .populate('createdBy', 'username email');
        if (!project) return res.status(404).json({ message: 'Project not found' });
        // Basic check
        if (project.createdBy._id.toString() !== req.user.id) {
             // In a real app, also check team membership
        }
        res.json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateProject = async (req, res) => {
    try {
        const project = await Project.findOneAndUpdate(
            { _id: req.params.id, createdBy: req.user.id },
            req.body,
            { new: true, runValidators: true }
        );
        if (!project) return res.status(404).json({ message: 'Project not found or unauthorized' });
        res.json(project);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteProject = async (req, res) => {
    try {
        const project = await Project.findOneAndDelete({ _id: req.params.id, createdBy: req.user.id });
        if (!project) return res.status(404).json({ message: 'Project not found or unauthorized' });
        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
