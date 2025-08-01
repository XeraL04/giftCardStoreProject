const mongoose = require('mongoose');

const testimonialSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User', // This links the testimonial to a specific user
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            required: true,
        },
        // You might want to add a field for approval if you want to moderate testimonials
        isApproved: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt fields automatically
    }
);

const Testimonial = mongoose.model('Testimonial', testimonialSchema);

module.exports = Testimonial;