const Team = require('../models/Team');

exports.createTeam = async (req, res) => {
    try {
        const team = new Team({
            ...req.body,
            createdBy: req.user.id
        });
        if (!team.members.includes(req.user.id)) {
            team.members.push(req.user.id);
        }
        await team.save();
        res.status(201).json(team);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getTeams = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const query = {
            $or: [
                { createdBy: req.user.id },
                { members: req.user.id }
            ]
        };
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        const teams = await Team.find(query)
            .populate('members', 'username email')
            .populate('createdBy', 'username email')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await Team.countDocuments(query);

        res.json({
            teams,
            totalPages: Math.ceil(count / limit),
            currentPage: Number(page)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getTeamById = async (req, res) => {
    try {
        const team = await Team.findOne({
            _id: req.params.id,
            $or: [{ createdBy: req.user.id }, { members: req.user.id }]
        }).populate('members', 'username email').populate('createdBy', 'username email');
        if (!team) return res.status(404).json({ message: 'Team not found' });
        res.json(team);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateTeam = async (req, res) => {
    try {
        const team = await Team.findOneAndUpdate(
            { _id: req.params.id, createdBy: req.user.id }, // Only creator can update
            req.body,
            { new: true, runValidators: true }
        ).populate('members', 'username email');
        if (!team) return res.status(404).json({ message: 'Team not found or unauthorized' });
        res.json(team);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteTeam = async (req, res) => {
    try {
        const team = await Team.findOneAndDelete({ _id: req.params.id, createdBy: req.user.id });
        if (!team) return res.status(404).json({ message: 'Team not found or unauthorized' });
        res.json({ message: 'Team deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
