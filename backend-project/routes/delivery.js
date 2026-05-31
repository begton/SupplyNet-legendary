const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// GET all deliveries
router.get('/', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [deliveries] = await connection.query(`
            SELECT d.*, sh.shipment_number FROM Delivery d
            LEFT JOIN Shipment sh ON d.shipment_id = sh.shipment_id
            ORDER BY d.created_at DESC
        `);
        connection.release();

        res.json(deliveries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET single delivery
router.get('/:id', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [deliveries] = await connection.query(
            'SELECT * FROM Delivery WHERE delivery_id = ?',
            [req.params.id]
        );
        connection.release();

        if (deliveries.length === 0) {
            return res.status(404).json({ message: 'Delivery not found' });
        }

        res.json(deliveries[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ADD new delivery
router.post('/', async (req, res) => {
    try {
        const { delivery_code, shipment_id, delivery_date, quantity_delivered, delivery_status } = req.body;

        if (!delivery_code || !shipment_id || !delivery_date || !quantity_delivered) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const connection = await pool.getConnection();
        
        try {
            const [result] = await connection.query(
                'INSERT INTO Delivery (delivery_code, shipment_id, delivery_date, quantity_delivered, delivery_status) VALUES (?, ?, ?, ?, ?)',
                [delivery_code, shipment_id, delivery_date, quantity_delivered, delivery_status || 'Pending']
            );
            connection.release();

            res.status(201).json({ 
                message: 'Delivery added successfully',
                delivery_id: result.insertId 
            });
        } catch (error) {
            connection.release();
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ message: 'Delivery code already exists' });
            }
            throw error;
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// UPDATE delivery
router.put('/:id', async (req, res) => {
    try {
        const { delivery_code, shipment_id, delivery_date, quantity_delivered, delivery_status } = req.body;

        const connection = await pool.getConnection();
        
        await connection.query(
            'UPDATE Delivery SET delivery_code = ?, shipment_id = ?, delivery_date = ?, quantity_delivered = ?, delivery_status = ? WHERE delivery_id = ?',
            [delivery_code, shipment_id, delivery_date, quantity_delivered, delivery_status, req.params.id]
        );
        connection.release();

        res.json({ message: 'Delivery updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE delivery
router.delete('/:id', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        
        await connection.query('DELETE FROM Delivery WHERE delivery_id = ?', [req.params.id]);
        connection.release();

        res.json({ message: 'Delivery deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
