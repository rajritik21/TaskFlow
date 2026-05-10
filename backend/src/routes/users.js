const router = require('express').Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get all users (protected route)
router.get('/', auth, async (req, res) => {
    try {
        const users = await User.find({}, { password: 0 }); // Exclude password from response
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get current user profile
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;