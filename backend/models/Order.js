const mongoose = require('mongoose');

// Define a sub-schema for individual items within an order
const orderItemSchema = new mongoose.Schema({
    giftCard: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GiftCard',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    priceAtPurchase: { // Store the price at the time of purchase for historical accuracy
        type: Number,
        required: true
    },
    // Optionally, store denormalized data (like brand, imageUrl) for immutability
    // This means if the original GiftCard changes, your order history remains accurate.
    brand: { type: String },
    imageUrl: { type: String },
});

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [orderItemSchema], // <-- THIS IS THE BIG CHANGE: An array of order items
    totalPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'pending' // Orders are 'pending' until payment is confirmed
    },
    purchasedAt: {
        type: Date
    },
    // You can keep a general order code here if applicable, or remove if codes are per item.
    code: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);