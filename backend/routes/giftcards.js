const express = require('express');
const {
    getAllGiftCards,
    getGiftCardById,
    createGiftCard,
    updateGiftCard,
    deleteGiftCard
} = require('../controllers/giftCardController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

const router = express.Router();

router.get('/', getAllGiftCards);
router.get('/:id', getGiftCardById);
router.post('/', protect, admin, createGiftCard);
router.put('/:id', protect, admin, updateGiftCard);
router.delete('/:id', protect, admin, deleteGiftCard);

module.exports = router;
