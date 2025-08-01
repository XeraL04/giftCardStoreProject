const express = require('express');
const router = express.Router();
const {
    getApprovedTestimonials,
    createTestimonial,
    getAllTestimonials,
    approveTestimonial,
    deleteTestimonial,
} = require('../controllers/testimonialController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

// Public route to get approved testimonials
router.route('/').get(getApprovedTestimonials);

// Private route for users to create a testimonial
router.route('/').post(protect, createTestimonial);

// Admin routes
router.route('/all').get(protect, admin, getAllTestimonials); // Get all testimonials (for admin review)
router.route('/:id/approve').put(protect, admin, approveTestimonial);
router.route('/:id').delete(protect, admin, deleteTestimonial);

module.exports = router;