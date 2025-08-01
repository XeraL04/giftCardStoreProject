const asyncHandler = require('express-async-handler'); // npm i express-async-handler
const Testimonial = require('../models/Testimonial');

// @desc    Get all approved testimonials
// @route   GET /api/testimonials
// @access  Public
const getApprovedTestimonials = asyncHandler(async (req, res) => {
    const testimonials = await Testimonial.find({ isApproved: true }).populate('user', 'name'); // Only send user name
    res.json(testimonials);
});

// @desc    Create a new testimonial
// @route   POST /api/testimonials
// @access  Private (Users only)
const createTestimonial = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;

    if (!rating || !comment) {
        res.status(400);
        throw new Error('Please add a rating and comment');
    }

    const testimonial = new Testimonial({
        user: req.user._id, // req.user comes from your protect middleware
        rating,
        comment,
    });

    const createdTestimonial = await testimonial.save();
    res.status(201).json(createdTestimonial);
});

// @desc    Get all testimonials (for admin to approve)
// @route   GET /api/testimonials/all
// @access  Private/Admin
const getAllTestimonials = asyncHandler(async (req, res) => {
    const testimonials = await Testimonial.find({}).populate('user', 'name');
    res.json(testimonials);
});

// @desc    Approve a testimonial
// @route   PUT /api/testimonials/:id/approve
// @access  Private/Admin
const approveTestimonial = asyncHandler(async (req, res) => {
    const testimonial = await Testimonial.findById(req.params.id);

    if (testimonial) {
        testimonial.isApproved = true;
        const updatedTestimonial = await testimonial.save();
        res.json(updatedTestimonial);
    } else {
        res.status(404);
        throw new Error('Testimonial not found');
    }
});

// @desc    Delete a testimonial
// @route   DELETE /api/testimonials/:id
// @access  Private/Admin
const deleteTestimonial = asyncHandler(async (req, res) => {
    const testimonial = await Testimonial.findById(req.params.id);

    if (testimonial) {
        await testimonial.deleteOne();
        res.json({ message: 'Testimonial removed' });
    } else {
        res.status(404);
        throw new Error('Testimonial not found');
    }
});


module.exports = {
    getApprovedTestimonials,
    createTestimonial,
    getAllTestimonials,
    approveTestimonial,
    deleteTestimonial,
};