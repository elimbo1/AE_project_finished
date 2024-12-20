const express = require('express');
const { Product, Review } = require("../database/models/Product");

const router = express.Router();

/**
 * Get all products
 */
router.get('/', async (_, res) => {
    try {
        const products = await Product.findAll({
            include: [{ model: Review, as: 'reviews' }],
        });
        res.status(200).json({ success: true, message: 'Products retrieved successfully', data: products });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to retrieve products', data: { error: error.message } });
    }
});

/**
 * Get product by ID
 */
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    if (isNaN(id)) {
        return res.status(400).json({ success: false, message: 'Invalid product ID', data: {} });
    }

    try {
        const product = await Product.findByPk(id, {
            include: [{ model: Review, as: 'reviews' }],
        });

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found', data: {} });
        }

        res.status(200).json({ success: true, message: 'Product retrieved successfully', data: product });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to retrieve product', data: { error: error.message } });
    }
});

/**
 * Create a new product
 */
router.post('/', async (req, res) => {
    const { title, price } = req.body;

    if (!title || price == null) {
        return res.status(400).json({ success: false, message: 'Title and price are required', data: {} });
    }

    try {
        const newProduct = await Product.create({
            title,
            price
        });

        res.status(201).json({ success: true, message: 'Product created successfully', data: newProduct });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to create product', data: { error: error.message } });
    }
});

/**
 * Update product by ID
 */
router.put('/:id', async (req, res) => {
    const { id } = req.params;

    if (isNaN(id)) {
        return res.status(400).json({ success: false, message: 'Invalid product ID', data: {} });
    }

    try {
        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found', data: {} });
        }

        const { title, price } = req.body;
        const updatedData = { title, price };

        const updatedProduct = await product.update(updatedData);

        res.status(200).json({ success: true, message: 'Product updated successfully', data: updatedProduct });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update product', data: { error: error.message } });
    }
});

/**
 * Delete product by ID
 */
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    if (isNaN(id)) {
        return res.status(400).json({ success: false, message: 'Invalid product ID', data: {} });
    }

    try {
        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found', data: {} });
        }

        await product.destroy();

        res.status(200).json({ success: true, message: 'Product deleted successfully', data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete product', data: { error: error.message } });
    }
});

module.exports = router;