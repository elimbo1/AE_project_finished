const express = require('express');
const { Review, Product } = require("../database/models/Product");

const router = express.Router();

/**
 * Get all reviews
 */
router.get('/', async (_, res) => {
    try {
        const reviews = await Review.findAll({
            include: [{ model: Product }],
        });
        res.status(200).json({ success: true, message: 'Reviews retrieved successfully', data: reviews });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to retrieve reviews', data: { error: error.message } });
    }
});

/**
 * Get review by ID
 */
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    if (isNaN(id)) {
        return res.status(400).json({ success: false, message: 'Invalid review ID', data: {} });
    }

    try {
        const review = await Review.findByPk(id, {
            include: [{ model: Product }],
        });

        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found', data: {} });
        }

        res.status(200).json({ success: true, message: 'Review retrieved successfully', data: review });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to retrieve review', data: { error: error.message } });
    }
});

/**
 * Create a new review
 */
router.post('/', async (req, res) => {
    const { message, productId } = req.body;

    if (!message || !productId) {
        return res.status(400).json({ success: false, message: 'Message and productId are required', data: {} });
    }

    try {
        const product = await Product.findByPk(productId);

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found', data: {} });
        }

        const newReview = await Review.create({
            message,
            productId,
        });

        res.status(201).json({ success: true, message: 'Review created successfully', data: newReview });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to create review', data: { error: error.message } });
    }
});

/**
 * Update review by ID
 */
router.put('/:id', async (req, res) => {
    const { id } = req.params;

    if (isNaN(id)) {
        return res.status(400).json({ success: false, message: 'Invalid review ID', data: {} });
    }

    try {
        const review = await Review.findByPk(id);

        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found', data: {} });
        }

        const { message } = req.body;
        const updatedData = { message };

        const updatedReview = await review.update(updatedData);

        res.status(200).json({ success: true, message: 'Review updated successfully', data: updatedReview });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update review', data: { error: error.message } });
    }
});

/**
 * Delete review by ID
 */
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    if (isNaN(id)) {
        return res.status(400).json({ success: false, message: 'Invalid review ID', data: {} });
    }

    try {
        const review = await Review.findByPk(id);

        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found', data: {} });
        }

        await review.destroy();

        res.status(200).json({ success: true, message: 'Review deleted successfully', data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete review', data: { error: error.message } });
    }
});

module.exports = router;