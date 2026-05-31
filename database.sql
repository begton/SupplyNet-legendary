-- SCMS Database Setup
-- Copy and paste this entire script into your XAMPP phpMyAdmin SQL tab

-- Create Database
CREATE DATABASE IF NOT EXISTS SCMS;
USE SCMS;

-- Create Supplier Table
CREATE TABLE Supplier (
    supplier_id INT AUTO_INCREMENT PRIMARY KEY,
    supplier_code VARCHAR(50) UNIQUE NOT NULL,
    supplier_name VARCHAR(100) NOT NULL,
    telephone VARCHAR(20),
    address VARCHAR(255),
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Shipment Table
CREATE TABLE Shipment (
    shipment_id INT AUTO_INCREMENT PRIMARY KEY,
    shipment_number VARCHAR(50) UNIQUE NOT NULL,
    supplier_id INT NOT NULL,
    shipment_date DATE NOT NULL,
    shipment_status ENUM('Pending', 'In Transit', 'Delivered', 'Cancelled') DEFAULT 'Pending',
    destination VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (supplier_id) REFERENCES Supplier(supplier_id) ON DELETE CASCADE
);

-- Create Delivery Table
CREATE TABLE Delivery (
    delivery_id INT AUTO_INCREMENT PRIMARY KEY,
    delivery_code VARCHAR(50) UNIQUE NOT NULL,
    shipment_id INT NOT NULL,
    delivery_date DATE NOT NULL,
    quantity_delivered INT NOT NULL,
    delivery_status ENUM('Pending', 'Completed', 'Failed') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (shipment_id) REFERENCES Shipment(shipment_id) ON DELETE CASCADE
);

-- Create Users Table for authentication
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data for Supplier
INSERT INTO Supplier (supplier_code, supplier_name, telephone, address, email) VALUES
('SUP001', 'Tech Supplies Co', '+250788123456', 'Kigali, Rwanda', 'tech@supplies.rw'),
('SUP002', 'Food Distributors Ltd', '+250789654321', 'Musanze, Rwanda', 'food@distributors.rw'),
('SUP003', 'Industrial Parts Inc', '+250787456789', 'Huye, Rwanda', 'parts@industrial.rw');

-- Insert sample user
INSERT INTO Users (username, password, email) VALUES
('admin', 'admin123', 'admin@scms.rw');

-- Create Report View for Daily Reports
CREATE VIEW daily_report AS
SELECT 
    DATE(d.created_at) as report_date,
    COUNT(DISTINCT s.supplier_id) as total_suppliers,
    COUNT(DISTINCT sh.shipment_id) as total_shipments,
    COUNT(DISTINCT d.delivery_id) as total_deliveries,
    SUM(d.quantity_delivered) as total_quantity
FROM Delivery d
LEFT JOIN Shipment sh ON d.shipment_id = sh.shipment_id
LEFT JOIN Supplier s ON sh.supplier_id = s.supplier_id
GROUP BY DATE(d.created_at);

-- Create Report View for Weekly Reports
CREATE VIEW weekly_report AS
SELECT 
    WEEK(d.created_at) as week_number,
    YEAR(d.created_at) as year,
    COUNT(DISTINCT s.supplier_id) as total_suppliers,
    COUNT(DISTINCT sh.shipment_id) as total_shipments,
    COUNT(DISTINCT d.delivery_id) as total_deliveries,
    SUM(d.quantity_delivered) as total_quantity
FROM Delivery d
LEFT JOIN Shipment sh ON d.shipment_id = sh.shipment_id
LEFT JOIN Supplier s ON sh.supplier_id = s.supplier_id
GROUP BY WEEK(d.created_at), YEAR(d.created_at);

-- Create Report View for Monthly Reports
CREATE VIEW monthly_report AS
SELECT 
    MONTH(d.created_at) as month_number,
    YEAR(d.created_at) as year,
    COUNT(DISTINCT s.supplier_id) as total_suppliers,
    COUNT(DISTINCT sh.shipment_id) as total_shipments,
    COUNT(DISTINCT d.delivery_id) as total_deliveries,
    SUM(d.quantity_delivered) as total_quantity
FROM Delivery d
LEFT JOIN Shipment sh ON d.shipment_id = sh.shipment_id
LEFT JOIN Supplier s ON sh.supplier_id = s.supplier_id
GROUP BY MONTH(d.created_at), YEAR(d.created_at);
