const mongoose = require('mongoose');

const giftCardSchema = new mongoose.Schema({
    brand: {
        type: String,
        required: true
    },
    value: {
        type: Number,
        required: true
    },
    imageUrl: {
        type: String
    },
    stock: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('GiftCard', giftCardSchema);
