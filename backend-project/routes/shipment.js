const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// GET all shipments
router.get('/', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [shipments] = await connection.query(`
            SELECT sh.*, s.supplier_name FROM Shipment sh
            LEFT JOIN Supplier s ON sh.supplier_id = s.supplier_id
            ORDER BY sh.created_at DESC
        `);
        connection.release();

        res.json(shipments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET single shipment
router.get('/:id', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [shipments] = await connection.query(
            'SELECT * FROM Shipment WHERE shipment_id = ?',
            [req.params.id]
        );
        connection.release();

        if (shipments.length === 0) {
            return res.status(404).json({ message: 'Shipment not found' });
        }

        res.json(shipments[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ADD new shipment
router.post('/', async (req, res) => {
    try {
        const { shipment_number, supplier_id, shipment_date, shipment_status, destination } = req.body;

        if (!shipment_number || !supplier_id || !shipment_date) {
            return res.status(400).json({ message: 'Number, supplier and date are required' });
        }

        const connection = await pool.getConnection();
        
        try {
            const [result] = await connection.query(
                'INSERT INTO Shipment (shipment_number, supplier_id, shipment_date, shipment_status, destination) VALUES (?, ?, ?, ?, ?)',
                [shipment_number, supplier_id, shipment_date, shipment_status || 'Pending', destination || null]
            );
            connection.release();

            res.status(201).json({ 
                message: 'Shipment added successfully',
                shipment_id: result.insertId 
            });
        } catch (error) {
            connection.release();
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ message: 'Shipment number already exists' });
            }
            throw error;
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// UPDATE shipment
router.put('/:id', async (req, res) => {
    try {
        const { shipment_number, supplier_id, shipment_date, shipment_status, destination } = req.body;

        const connection = await pool.getConnection();
        
        await connection.query(
            'UPDATE Shipment SET shipment_number = ?, supplier_id = ?, shipment_date = ?, shipment_status = ?, destination = ? WHERE shipment_id = ?',
            [shipment_number, supplier_id, shipment_date, shipment_status, destination || null, req.params.id]
        );
        connection.release();

        res.json({ message: 'Shipment updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE shipment
router.delete('/:id', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        
        await connection.query('DELETE FROM Shipment WHERE shipment_id = ?', [req.params.id]);
        connection.release();

        res.json({ message: 'Shipment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
