const express = require('express');
const { Category } = require("../database/models/Category");

const router = express.Router();

/**
 * Get all categories
 */
router.get('/', async (_, res) => {
    try {
        const categories = await Category.findAll();
        res.status(200).json({ success: true, message: 'Categories retrieved successfully', data: categories });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to retrieve categories', data: { error: error.message } });
    }
});

/**
 * Get category by ID
 */
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    if (isNaN(id)) {
        return res.status(400).json({ success: false, message: 'Invalid category ID', data: {} });
    }

    try {
        const category = await Category.findByPk(id);

        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found', data: {} });
        }

        res.status(200).json({ success: true, message: 'Category retrieved successfully', data: category });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to retrieve category', data: { error: error.message } });
    }
});

/**
 * Create a new category
 */
router.post('/', async (req, res) => {
    const { name, slug } = req.body;

    if (!name || !slug) {
        return res.status(400).json({ success: false, message: 'Name and slug are required', data: {} });
    }

    try {
        const newCategory = await Category.create({
            name,
            slug,
        });

        res.status(201).json({ success: true, message: 'Category created successfully', data: newCategory });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to create category', data: { error: error.message } });
    }
});

/**
 * Update category by ID
 */
router.put('/:id', async (req, res) => {
    const { id } = req.params;

    if (isNaN(id)) {
        return res.status(400).json({ success: false, message: 'Invalid category ID', data: {} });
    }

    try {
        const category = await Category.findByPk(id);

        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found', data: {} });
        }

        const { name, slug } = req.body;
        const updatedData = { name, slug };

        const updatedCategory = await category.update(updatedData);

        res.status(200).json({ success: true, message: 'Category updated successfully', data: updatedCategory });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update category', data: { error: error.message } });
    }
});

/**
 * Delete category by ID
 */
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    if (isNaN(id)) {
        return res.status(400).json({ success: false, message: 'Invalid category ID', data: {} });
    }

    try {
        const category = await Category.findByPk(id);

        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found', data: {} });
        }

        await category.destroy();

        res.status(200).json({ success: true, message: 'Category deleted successfully', data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete category', data: { error: error.message } });
    }
});

module.exports = router;
