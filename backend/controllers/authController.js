const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

exports.register = async (req, res) => {
    const { name, email, password, phoneNumber } = req.body; // <-- Add phoneNumber here
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Email already registered' });
        }
        // You might want to check for phoneNumber uniqueness here if you set unique: true in model
        // if (phoneNumber) {
        //     const phoneExists = await User.findOne({ phoneNumber });
        //     if (phoneExists) {
        //         return res.status(400).json({ message: 'Phone number already registered' });
        //     }
        // }

        const user = await User.create({ name, email, password, phoneNumber }); // <-- Save phoneNumber

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber, // <-- Include phoneNumber in response
            role: user.role,
            token: generateToken(user._id)
        });
    } catch (error) {
        console.error("Register error:", error); // Log error for debugging
        res.status(500).json({ message: 'Server error' });
    }
};


exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber, // <-- Include phoneNumber in response
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error("Login error:", error); // Log error for debugging
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getProfile = (req, res) => {
    // req.user is populated by `protect` middleware
    if (req.user) {
        // Ensure you're only sending necessary fields, password already excluded by protect middleware usually
        // If your protect middleware doesn't populate req.user with selected fields, you might need to query again here
        res.json({
            _id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            phoneNumber: req.user.phoneNumber, // <-- Include phoneNumber
            role: req.user.role,
            // Add other fields you want to expose
        });
    } else {
        res.status(401).json({ message: 'User not found or not authenticated' });
    }
};

exports.logout = (req, res) => {
    // As mentioned, JWT stateless, this is just for client-side confirmation
    res.json({ message: 'Logged out successfully' });
};

// --- NEW CONTROLLER FUNCTIONS ---

// @desc    Get user profile by ID
// @route   GET /auth/users/:id
// @access  Private/Admin (or Private for self-profile)
exports.getUserProfileById = async (req, res) => {
    const userId = req.params.id;
    try {
        // Allow a user to get their own profile, or an admin to get any profile
        if (req.user._id.toString() === userId || req.user.role === 'admin') {
            const user = await User.findById(userId).select('-password'); // Exclude password

            if (user) {
                res.json({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    phoneNumber: user.phoneNumber, // <-- Include phoneNumber
                    role: user.role,
                });
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } else {
            res.status(403).json({ message: 'Not authorized to view this profile' });
        }
    } catch (error) {
        console.error("Get user profile by ID error:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update user profile
// @route   PUT /auth/users/:id
// @access  Private (User can update their own, Admin can update any)
exports.updateUserProfile = async (req, res) => {
    const userId = req.params.id;
    const { name, email, phoneNumber, password, role } = req.body;

    try {
        const user = await User.findById(userId);

        if (user) {
            // Only allow user to update their own profile, or admin to update any
            if (req.user._id.toString() !== userId && req.user.role !== 'admin') {
                return res.status(403).json({ message: 'Not authorized to update this profile' });
            }

            // Prevent non-admins from changing their role
            if (req.user.role !== 'admin' && role && role !== user.role) {
                return res.status(403).json({ message: 'Not authorized to change user role' });
            }
            
            // Check for unique email/phone if they are being updated to a new value
            if (email && email !== user.email) {
                const emailExists = await User.findOne({ email });
                if (emailExists && emailExists._id.toString() !== user._id.toString()) {
                    return res.status(400).json({ message: 'Email already in use by another account' });
                }
            }
            if (phoneNumber && phoneNumber !== user.phoneNumber) {
                const phoneExists = await User.findOne({ phoneNumber });
                if (phoneExists && phoneExists._id.toString() !== user._id.toString()) {
                    return res.status(400).json({ message: 'Phone number already in use by another account' });
                }
            }


            user.name = name || user.name;
            user.email = email || user.email;
            user.phoneNumber = phoneNumber !== undefined ? phoneNumber : user.phoneNumber; // Handle null/empty string for optional fields

            // Handle password update separately or carefully
            if (password) {
                user.password = password; // The pre('save') middleware will hash this
            }
            
            // Only allow admin to change role
            if (req.user.role === 'admin' && role) {
                user.role = role;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                phoneNumber: updatedUser.phoneNumber, // <-- Return updated phoneNumber
                role: updatedUser.role,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error("Update user profile error:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete user
// @route   DELETE /auth/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.findById(userId);

        if (user) {
            // Prevent admin from deleting themselves (optional, but good practice)
            if (user._id.toString() === req.user._id.toString()) {
                return res.status(400).json({ message: 'Cannot delete your own account via this endpoint' });
            }

            await user.deleteOne();
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error("Delete user error:", error);
        res.status(500).json({ message: 'Server error' });
    }
};