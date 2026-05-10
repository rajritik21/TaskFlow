const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

// Register
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ 
                message: 'Email already registered'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ 
            username, 
            email, 
            password: hashedPassword 
        });
        await user.save();
        
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        const userWithoutPassword = { _id: user._id, username: user.username, email: user.email };
        res.status(201).json({ message: 'User created successfully', token, user: userWithoutPassword });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ message: 'Invalid password' });

        // Create token with the correct field name for the ID
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        
        console.log('User logged in:', user.username);
        console.log('Generated token with ID:', user._id);
        
        const userWithoutPassword = { _id: user._id, username: user.username, email: user.email, profilePicture: user.profilePicture };
        res.json({ token, user: userWithoutPassword });
    } catch (error) {
        console.error('Login error:', error.message);
        res.status(400).json({ message: error.message });
    }
});

// Get current user profile
router.get('/profile', auth, async (req, res) => {
    try {
        console.log('Fetching profile for user ID:', req.user.id);
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            console.log('User not found in database');
            return res.status(404).json({ message: 'User not found' });
        }
        console.log('User found:', user.username);
        res.json(user);
    } catch (error) {
        console.error('Profile error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add profile picture upload endpoint
router.post('/upload-profile-picture', auth, async (req, res) => {
    try {
        // In a real implementation, you would handle file upload with multer
        // and store the image URL (either locally or in cloud storage)
        
        // For now, we'll just use a dummy URL
        const profilePictureUrl = `https://ui-avatars.com/api/?name=${req.body.username || 'User'}&background=3f51b5&color=fff`;
        
        // Update user profile
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { profilePicture: profilePictureUrl },
            { new: true }
        ).select('-password');
        
        res.json({ profilePicture: profilePictureUrl });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
    try {
        const { username, email, profilePicture } = req.body;
        console.log('Updating profile for user ID:', req.user.id);
        console.log('New profile data:', { username, email, profilePicture });

        // Check if new email is already taken
        if (email) {
            const existingUser = await User.findOne({ 
                email, 
                _id: { $ne: req.user.id } 
            });
            
            if (existingUser) {
                return res.status(400).json({ message: 'Email is already registered' });
            }
        }

        // Create an update object with only defined fields
        const updateData = {};
        if (username) updateData.username = username;
        if (email) updateData.email = email;
        if (profilePicture !== undefined) updateData.profilePicture = profilePicture;

        // Update user profile
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            updateData,
            { new: true }
        ).select('-password');

        console.log('User updated:', updatedUser.username);
        res.json(updatedUser);
    } catch (error) {
        console.error('Profile update error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// Change user password
router.put('/change-password', auth, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Current password and new password are required' });
        }
        
        // Validate minimum password length
        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'Password should be at least 6 characters long' });
        }
        
        // Find user
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Check if current password is correct
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }
        
        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        // Update password
        user.password = hashedPassword;
        await user.save();
        
        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Password change error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;