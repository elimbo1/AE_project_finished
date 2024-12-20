const express = require('express');
const bcrypt = require('bcrypt');
const User = require("../database/models/User");

const router = express.Router();

/**
 * Get all users
 */
router.get('/', async (_, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] },
        });
        res.status(200).json({ success: true, message: 'Users retrieved successfully', data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to retrieve users', data: { error: error.message } });
    }
});

/**
 * Get user by ID
 */
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    if (isNaN(id)) {
        return res.status(400).json({ success: false, message: 'Invalid user ID', data: {} });
    }

    try {
        const user = await User.findByPk(id, { attributes: { exclude: ['password'] } });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found', data: {} });
        }

        res.status(200).json({ success: true, message: 'User retrieved successfully', data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to retrieve user', data: { error: error.message } });
    }
});

/**
 * Create a new user
 */
router.post('/', async (req, res) => {
    const { email, password, ...otherData } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required', data: {} });
    }

    try {
        const existingUser = await User.findOne({ where: { email } });

        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists', data: {} });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        const newUser = await User.create({
            email,
            password: hashedPassword,
            ...otherData,
        });

        // Remove sensitive data
        delete newUser.dataValues.password;

        res.status(201).json({ success: true, message: 'User created successfully', data: newUser });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to create user', data: { error: error.message } });
    }
});


/**
 * Update user by ID
 */
router.put('/:id', async (req, res) => {
    const { id } = req.params;

    if (isNaN(id)) {
        return res.status(400).json({ success: false, message: 'Invalid user ID', data: {} });
    }

    try {
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found', data: {} });
        }

        // Update user data
        const { email, password, role } = req.body;

        const updatedData = {};
        if (email) updatedData.email = email;
        if (password) updatedData.password = bcrypt.hashSync(password, 10); // Hash the password if it is being updated
        if (role) updatedData.role = role;

        const updatedUser = await user.update(updatedData);

        // Remove sensitive data
        delete updatedUser.dataValues.password;

        res.status(200).json({ success: true, message: 'User updated successfully', data: updatedUser });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update user', data: { error: error.message } });
    }
});

/**
 * Delete user by ID
 */
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    if (isNaN(id)) {
        return res.status(400).json({ success: false, message: 'Invalid user ID', data: {} });
    }

    try {
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found', data: {} });
        }

        await user.destroy();

        res.status(200).json({ success: true, message: 'User deleted successfully', data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete user', data: { error: error.message } });
    }
});

module.exports = router;