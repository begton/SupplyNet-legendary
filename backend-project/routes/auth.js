const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const jwt = require('jsonwebtoken');

// Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password required' });
        }

        const connection = await pool.getConnection();
        const [users] = await connection.query(
            'SELECT * FROM Users WHERE username = ?',
            [username]
        );
        connection.release();

        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = users[0];
        if (user.password !== password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { user_id: user.user_id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ token, message: 'Login successful' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Register
router.post('/register', async (req, res) => {
    try {
        const { username, password, email } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password required' });
        }

        const connection = await pool.getConnection();
        
        try {
            await connection.query(
                'INSERT INTO Users (username, password, email) VALUES (?, ?, ?)',
                [username, password, email || null]
            );
            connection.release();

            res.status(201).json({ message: 'User registered successfully' });
        } catch (error) {
            connection.release();
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ message: 'Username already exists' });
            }
            throw error;
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
