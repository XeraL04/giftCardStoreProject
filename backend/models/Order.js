const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    giftCard: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GiftCard',
        required: true
    },
    quantity: {
        type: Number,
        default: 1
    },
    totalPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: [
            'pending',
            'completed',
            'cancelled'
        ],
        default: 'pending'
    },
    // ============================
    //   OFFLINE PAYMENT FIELDS
    // ============================

    paymentMethod: {
        type: String,
        enum: ['whatsapp'],
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending_payment', 'payment_review', 'paid', 'cancelled'],
        default: 'pending_payment'
    },

    paymentProof: {
        url: { type: String },        // URL path to uploaded proof file
        transactionId: { type: String } // Optional manual transaction ID
    },
    paymentReferenceCode: {
        type: String,
        required: true                // Generated when creating order
    },

    paymentInstructions: {
        type: String                  // Optional custom instructions for this order
    },

    paymentDueDate: {
        type: Date                     // Deadline to complete payment
    },
    // When payment was approved (for analytics)
    paidAt: { type: Date },

    purchasedAt: { type: Date }
}, { timestamps: true });

// Generate a unique reference code before saving (only if new)
orderSchema.pre('validate', function (next) {
    if (this.isNew && !this.paymentReferenceCode) {
        // Format: ORD-YYYYMMDD-HHMMSS-Random4
        const now = new Date();
        this.paymentReferenceCode =
            'ORD-' +
            now.toISOString().replace(/[-:T.Z]/g, '').slice(0, 14) +
            '-' +
            Math.floor(1000 + Math.random() * 9000);
    }
    next();
});

module.exports = mongoose.model('Order', orderSchema);