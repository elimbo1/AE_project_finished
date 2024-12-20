const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../database/models/User');
const { isValidToken } = require('../utils');

const router = express.Router();

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required', data: {} });
    }

    try {
        // Check if the user exists
        const existingUser = await User.findOne({ where: { email } });
        if (!existingUser) {
            return res.status(404).json({ success: false, message: 'User not found', data: {} });
        }

        // Validate the password
        const isValidPassword = bcrypt.compareSync(password, existingUser.dataValues.password);
        if (!isValidPassword) {
            return res.status(401).json({ success: false, message: 'Invalid password', data: {} });
        }

        // Generate a token
        const token = jwt.sign(
            { id: existingUser.dataValues.id },
            process.env.TOKEN_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: { token },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'An error occurred during login',
            data: { error: error.message },
        });
    }
});

router.post('/check', (req, res) => {
    const { token } = req.body;
    console.log('Received token:', token); // Log the received token

    if (!token) {
        return res.status(400).json({
            success: false,
            message: 'Token is required',
            data: {},
        });
    }

    try {
        const validToken = jwt.verify(token, process.env.TOKEN_SECRET);
        res.status(200).json({
            success: true,
            message: 'Token is valid',
            data: { userId: validToken.id },
        });
    } catch (error) {
        console.error('Token verification error:', error.message); // Log the error message
        res.status(401).json({
            success: false,
            message: 'Invalid or expired token',
            data: { error: error.message },
        });
    }
});

router.post('/register', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required', data: {} });
    }

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists', data: {} });
        }

        // Hash the password
        const hashedPassword = bcrypt.hashSync(password, 10);

        // Create a new user
        const newUser = await User.create({
            email,
            password: hashedPassword,
            role: "user"
        });

        // Generate a token for the new user
        const token = jwt.sign({ id: newUser.id }, process.env.TOKEN_SECRET, {
            expiresIn: '1h',
        });

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: { token },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'An error occurred while registering the user',
            data: { error: error.message },
        });
    }
});

module.exports = router;