const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// GET daily reports
router.get('/daily', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [reports] = await connection.query('SELECT * FROM daily_report ORDER BY report_date DESC');
        connection.release();

        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET weekly reports
router.get('/weekly', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [reports] = await connection.query('SELECT * FROM weekly_report ORDER BY year DESC, week_number DESC');
        connection.release();

        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET monthly reports
router.get('/monthly', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [reports] = await connection.query('SELECT * FROM monthly_report ORDER BY year DESC, month_number DESC');
        connection.release();

        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET summary statistics
router.get('/summary', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        
        const [supplierCount] = await connection.query('SELECT COUNT(*) as count FROM Supplier');
        const [shipmentCount] = await connection.query('SELECT COUNT(*) as count FROM Shipment');
        const [deliveryCount] = await connection.query('SELECT COUNT(*) as count FROM Delivery');
        const [totalQuantity] = await connection.query('SELECT SUM(quantity_delivered) as total FROM Delivery');
        
        connection.release();

        res.json({
            total_suppliers: supplierCount[0].count,
            total_shipments: shipmentCount[0].count,
            total_deliveries: deliveryCount[0].count,
            total_quantity: totalQuantity[0].total || 0
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
