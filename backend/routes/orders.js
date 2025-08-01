const express = require('express');
const { placeOrder, getUserOrders, getAllOrders, simulateCheckout  } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

const router = express.Router();

router.post('/', protect, placeOrder);
router.get('/', protect, admin, getAllOrders);
router.get('/me', protect, getUserOrders);
router.post('/simulate-checkout', protect, simulateCheckout);


module.exports = router;
