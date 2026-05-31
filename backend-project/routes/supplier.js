const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// GET all suppliers
router.get('/', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [suppliers] = await connection.query('SELECT * FROM Supplier');
        connection.release();

        res.json(suppliers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET single supplier
router.get('/:id', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [suppliers] = await connection.query(
            'SELECT * FROM Supplier WHERE supplier_id = ?',
            [req.params.id]
        );
        connection.release();

        if (suppliers.length === 0) {
            return res.status(404).json({ message: 'Supplier not found' });
        }

        res.json(suppliers[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ADD new supplier
router.post('/', async (req, res) => {
    try {
        const { supplier_code, supplier_name, telephone, address, email } = req.body;

        if (!supplier_code || !supplier_name) {
            return res.status(400).json({ message: 'Code and name are required' });
        }

        const connection = await pool.getConnection();
        
        try {
            const [result] = await connection.query(
                'INSERT INTO Supplier (supplier_code, supplier_name, telephone, address, email) VALUES (?, ?, ?, ?, ?)',
                [supplier_code, supplier_name, telephone || null, address || null, email || null]
            );
            connection.release();

            res.status(201).json({ 
                message: 'Supplier added successfully',
                supplier_id: result.insertId 
            });
        } catch (error) {
            connection.release();
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ message: 'Supplier code already exists' });
            }
            throw error;
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
