const express = require('express');
const { Order, OrderProduct } = require("../database/models/Order");
const { Product } = require("../database/models/Product");

const router = express.Router();

/**
 * Get all orders
 */
router.get('/', async (_, res) => {
    try {
        const orders = await Order.findAll({
            include: [{ model: Product, as: 'products', through: { attributes: ['quantity'] } }],
        });
        res.status(200).json({ success: true, message: 'Orders retrieved successfully', data: orders });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to retrieve orders', data: { error: error.message } });
    }
});

/**
 * Get order by ID
 */
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    if (isNaN(id)) {
        return res.status(400).json({ success: false, message: 'Invalid order ID', data: {} });
    }

    try {
        const order = await Order.findByPk(id, {
            include: [{ model: Product, as: 'products', through: { attributes: ['quantity'] } }],
        });

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found', data: {} });
        }

        res.status(200).json({ success: true, message: 'Order retrieved successfully', data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to retrieve order', data: { error: error.message } });
    }
});

/**
 * Create a new order
 */
router.post('/', async (req, res) => {
    const { products } = req.body;
    console.log('Products:', JSON.stringify(products));

    // Check if products are provided
    if (!products || !Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ success: false, message: 'Products are required', data: {} });
    }

    try {
        // Create a new order
        const newOrder = await Order.create();

        // Map the products to the format expected by OrderProduct
        const orderProducts = products.map(({ id, quantity }) => ({
            orderId: newOrder.id,     // Associate with the new order
            productId: id,            // Correct field for productId
            quantity: quantity        // Set the quantity for each product
        }));

        // Insert order products into the junction table (OrderProduct)
        await OrderProduct.bulkCreate(orderProducts);

        // Retrieve the newly created order with associated products
        const createdOrder = await Order.findByPk(newOrder.id, {
            include: [{ model: Product, as: 'products', through: { attributes: ['quantity'] } }]
        });

        // Send the response with the newly created order
        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            data: createdOrder
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create order',
            data: { error: error.message }
        });
    }
});

/**
 * Update order by ID
 */
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { products } = req.body; // Array of { productId, quantity }

    if (isNaN(id)) {
        return res.status(400).json({ success: false, message: 'Invalid order ID', data: {} });
    }

    if (!products || !Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ success: false, message: 'Products are required', data: {} });
    }

    try {
        const order = await Order.findByPk(id);

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found', data: {} });
        }

        // Remove existing products from the order
        await OrderProduct.destroy({ where: { orderId: id } });

        // Add new products to the order
        const orderProducts = products.map(({ productId, quantity }) => ({
            orderId: id,
            productId,
            quantity,
        }));
        await OrderProduct.bulkCreate(orderProducts);

        const updatedOrder = await Order.findByPk(id, {
            include: [{ model: Product, as: 'products', through: { attributes: ['quantity'] } }],
        });

        res.status(200).json({ success: true, message: 'Order updated successfully', data: updatedOrder });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update order', data: { error: error.message } });
    }
});

/**
 * Delete order by ID
 */
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    if (isNaN(id)) {
        return res.status(400).json({ success: false, message: 'Invalid order ID', data: {} });
    }

    try {
        const order = await Order.findByPk(id);

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found', data: {} });
        }

        // Delete the order
        await order.destroy();

        res.status(200).json({ success: true, message: 'Order deleted successfully', data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete order', data: { error: error.message } });
    }
});

module.exports = router;