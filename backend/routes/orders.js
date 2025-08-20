const express = require('express');
const { 
    placeOrder, 
    getUserOrders, 
    getAllOrders, 
    uploadPaymentProof,
    verifyPayment,
    viewPaymentProof
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.post('/', protect, placeOrder);
router.get('/', protect, admin, getAllOrders);
router.get('/me', protect, getUserOrders);

// New offline payment routes:
router.get('/:orderId/proof', protect, viewPaymentProof);
router.post('/upload-proof/:orderId', protect, upload.single('proof'), uploadPaymentProof);
router.put('/verify-payment/:orderId', protect, admin, verifyPayment);


module.exports = router;
