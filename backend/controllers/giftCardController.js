const GiftCard = require('../models/GiftCard');

exports.getAllGiftCards = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1; // Default to page 1
        const limit = parseInt(req.query.limit, 10) || 10; // Default limit 10 items per page

        const brandFilter = req.query.brand ? req.query.brand.trim() : null;
        const searchTerm = req.query.search ? req.query.search.trim() : null;

        // Build the query filter
        let filter = {};

        if (brandFilter) {
            // Exact brand match (case insensitive)
            filter.brand = { $regex: new RegExp(`^${brandFilter}$`, 'i') };
        }

        if (searchTerm) {
            // Search in 'brand' field (case insensitive contains)
            filter.brand = { $regex: new RegExp(searchTerm, 'i') };
            // Optional: extend filter to other fields (like 'value' if needed)
        }

        // Count total documents for pagination meta
        const totalGiftCards = await GiftCard.countDocuments(filter);

        // Retrieve paginated gift cards
        const giftCards = await GiftCard.find(filter)
            .skip((page - 1) * limit)
            .limit(limit);

        // Respond with pagination metadata and data
        res.json({
            totalGiftCards,
            totalPages: Math.ceil(totalGiftCards / limit),
            currentPage: page,
            giftCards,
        });
    } catch (error) {
        console.error("Error fetching gift cards:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getGiftCardById = async (req, res) => {
    try {
        const giftCard = await GiftCard.findById(req.params.id);
        if (!giftCard) return res.status(404).json({ message: 'Gift card not found' });
        res.json(giftCard);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.createGiftCard = async (req, res) => {
    try {
        const { brand, value, imageUrl, stock, price } = req.body;
        const giftCard = new GiftCard({ brand, value, imageUrl, stock, price });
        await giftCard.save();
        res.status(201).json(giftCard);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateGiftCard = async (req, res) => {
    try {
        const giftCard = await GiftCard.findById(req.params.id);
        if (!giftCard) return res.status(404).json({ message: 'Gift card not found' });

        const { brand, value, imageUrl, stock, price } = req.body;
        giftCard.brand = brand || giftCard.brand;
        giftCard.value = value || giftCard.value;
        giftCard.imageUrl = imageUrl || giftCard.imageUrl;
        giftCard.stock = stock !== undefined ? stock : giftCard.stock;
        giftCard.price = price || giftCard.price;

        await giftCard.save();
        res.json(giftCard);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteGiftCard = async (req, res) => {
    try {
        const giftCard = await GiftCard.findById(req.params.id);
        if (!giftCard) return res.status(404).json({ message: 'Gift card not found' });

        await giftCard.deleteOne();
        res.json({ message: 'Gift card removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
