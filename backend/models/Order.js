const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    giftCard: { type: mongoose.Schema.Types.ObjectId, ref: 'GiftCard', required: true },
    quantity: { type: Number, default: 1 },
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending' },
    purchasedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);