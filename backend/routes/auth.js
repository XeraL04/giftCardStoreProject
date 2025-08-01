const express = require('express');
const { register, login, getProfile, logout,
        getUserProfileById, updateUserProfile, deleteUser
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const router = express.Router();

// Existing routes
router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getProfile); // Get currently authenticated user's profile
router.post('/logout', protect, logout);

// New routes for user management by ID
// GET /auth/users/:id - Get a specific user's profile by ID
// PUT /auth/users/:id - Update a specific user's profile by ID
// DELETE /auth/users/:id - Delete a specific user by ID (Admin only)
router.route('/users/:id')
    .get(protect, getUserProfileById)    // Protected: user can get their own, admin can get any
    .put(protect, updateUserProfile)     // Protected: user can update their own, admin can update any
    .delete(protect, admin, deleteUser); // Protected and Admin-only

module.exports = router;