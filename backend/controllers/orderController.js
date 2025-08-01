const Order = require('../models/Order');
const GiftCard = require('../models/GiftCard');

exports.placeOrder = async (req, res) => {
    try {
        const { giftCardId, quantity } = req.body;

        const giftCard = await GiftCard.findById(giftCardId);
        if (!giftCard) return res.status(404).json({ message: 'Gift card not found' });
        if (giftCard.stock < quantity) {
            return res.status(400).json({ message: 'Insufficient stock' });
        }

        const totalPrice = giftCard.price * quantity;

        // Decrease stock
        giftCard.stock -= quantity;
        await giftCard.save();

        const order = new Order({
            user: req.user._id,
            giftCard: giftCardId,
            quantity,
            totalPrice,
            status: 'completed',
            purchasedAt: Date.now()
        });

        await order.save();

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getUserOrders = async (req, res) => {
    try {
        const userId = req.user._id;

        // Parse query parameters with defaults
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const startDate = req.query.startDate ? new Date(req.query.startDate) : null;
        const endDate = req.query.endDate ? new Date(req.query.endDate) : null;
        const sortField = req.query.sort || 'purchasedAt';
        const sortOrder = req.query.order === 'asc' ? 1 : -1; // descending by default

        // Build filter query
        const filter = { user: userId };

        if (startDate || endDate) {
            filter.purchasedAt = {};
            if (startDate) filter.purchasedAt.$gte = startDate;
            if (endDate) filter.purchasedAt.$lte = endDate;
        }

        // Count total filtered documents (for pagination metadata)
        const totalOrders = await Order.countDocuments(filter);

        // Fetch paginated, filtered, and sorted orders
        const orders = await Order.find(filter)
            .populate('giftCard')
            .sort({ [sortField]: sortOrder })
            .skip((page - 1) * limit)
            .limit(limit);

        res.json({
            totalOrders,       // total count for all filtered results
            totalPages: Math.ceil(totalOrders / limit),
            currentPage: page,
            orders,
        });
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        // Parse query params for pagination, filtering and sorting
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 20; // admins may want larger pages
        const startDate = req.query.startDate ? new Date(req.query.startDate) : null;
        const endDate = req.query.endDate ? new Date(req.query.endDate) : null;
        const sortField = req.query.sort || 'purchasedAt';
        const sortOrder = req.query.order === 'asc' ? 1 : -1;

        const filter = {};

        if (startDate || endDate) {
            filter.purchasedAt = {};
            if (startDate) filter.purchasedAt.$gte = startDate;
            if (endDate) filter.purchasedAt.$lte = endDate;
        }

        const totalOrders = await Order.countDocuments(filter);

        const orders = await Order.find(filter)
            .populate('giftCard')
            .populate('user', 'name email')
            .sort({ [sortField]: sortOrder })
            .skip((page - 1) * limit)
            .limit(limit);

        res.json({
            totalOrders,
            totalPages: Math.ceil(totalOrders / limit),
            currentPage: page,
            orders,
        });
    } catch (error) {
        console.error("Error fetching all orders:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Simulated checkout — creates orders, decrements stock, returns success

exports.simulateCheckout = async (req, res) => {
    const { items } = req.body; // [{ giftCardId, quantity }, ...]
    try {
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }
        const createdOrders = [];
        for (const item of items) {
            const giftCard = await GiftCard.findById(item.giftCardId);
            if (!giftCard) {
                return res.status(404).json({ message: `Gift card not found (id: ${item.giftCardId})` });
            }
            if (giftCard.stock < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for ${giftCard.brand}` });
            }
            // Decrement stock
            giftCard.stock -= item.quantity;
            await giftCard.save();
            // Create order
            const order = new Order({
                user: req.user._id,
                giftCard: giftCard._id,
                quantity: item.quantity,
                totalPrice: giftCard.price * item.quantity,
                status: 'completed', // or 'simulated'
                purchasedAt: new Date(),
            });
            await order.save();
            createdOrders.push(order);
        }
        res.json({
            message: 'Simulated payment successful, orders created!',
            orders: createdOrders,
        });
    } catch (err) {
        console.error('Simulated checkout error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};
