-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 31, 2026 at 10:02 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `scms`
--

-- --------------------------------------------------------

--
-- Stand-in structure for view `daily_report`
-- (See below for the actual view)
--
CREATE TABLE `daily_report` (
`report_date` date
,`total_suppliers` bigint(21)
,`total_shipments` bigint(21)
,`total_deliveries` bigint(21)
,`total_quantity` decimal(32,0)
);

-- --------------------------------------------------------

--
-- Table structure for table `delivery`
--

CREATE TABLE `delivery` (
  `delivery_id` int(11) NOT NULL,
  `delivery_code` varchar(50) NOT NULL,
  `shipment_id` int(11) NOT NULL,
  `delivery_date` date NOT NULL,
  `quantity_delivered` int(11) NOT NULL,
  `delivery_status` enum('Pending','Completed','Failed') DEFAULT 'Pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Stand-in structure for view `monthly_report`
-- (See below for the actual view)
--
CREATE TABLE `monthly_report` (
`month_number` int(2)
,`year` int(4)
,`total_suppliers` bigint(21)
,`total_shipments` bigint(21)
,`total_deliveries` bigint(21)
,`total_quantity` decimal(32,0)
);

-- --------------------------------------------------------

--
-- Table structure for table `shipment`
--

CREATE TABLE `shipment` (
  `shipment_id` int(11) NOT NULL,
  `shipment_number` varchar(50) NOT NULL,
  `supplier_id` int(11) NOT NULL,
  `shipment_date` date NOT NULL,
  `shipment_status` enum('Pending','In Transit','Delivered','Cancelled') DEFAULT 'Pending',
  `destination` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `supplier`
--

CREATE TABLE `supplier` (
  `supplier_id` int(11) NOT NULL,
  `supplier_code` varchar(50) NOT NULL,
  `supplier_name` varchar(100) NOT NULL,
  `telephone` varchar(20) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `supplier`
--

INSERT INTO `supplier` (`supplier_id`, `supplier_code`, `supplier_name`, `telephone`, `address`, `email`, `created_at`) VALUES
(1, 'SUP001', 'Tech Supplies Co', '+250788123456', 'Kigali, Rwanda', 'tech@supplies.rw', '2026-05-30 09:58:33'),
(2, 'SUP002', 'Food Distributors Ltd', '+250789654321', 'Musanze, Rwanda', 'food@distributors.rw', '2026-05-30 09:58:33'),
(3, 'SUP003', 'Industrial Parts Inc', '+250787456789', 'Huye, Rwanda', 'parts@industrial.rw', '2026-05-30 09:58:33');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `password`, `email`, `created_at`) VALUES
(1, 'admin', 'admin123', 'admin@scms.rw', '2026-05-30 09:58:34');

-- --------------------------------------------------------

--
-- Stand-in structure for view `weekly_report`
-- (See below for the actual view)
--
CREATE TABLE `weekly_report` (
`week_number` int(2)
,`year` int(4)
,`total_suppliers` bigint(21)
,`total_shipments` bigint(21)
,`total_deliveries` bigint(21)
,`total_quantity` decimal(32,0)
);

-- --------------------------------------------------------

--
-- Structure for view `daily_report`
--
DROP TABLE IF EXISTS `daily_report`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `daily_report`  AS SELECT cast(`d`.`created_at` as date) AS `report_date`, count(distinct `s`.`supplier_id`) AS `total_suppliers`, count(distinct `sh`.`shipment_id`) AS `total_shipments`, count(distinct `d`.`delivery_id`) AS `total_deliveries`, sum(`d`.`quantity_delivered`) AS `total_quantity` FROM ((`delivery` `d` left join `shipment` `sh` on(`d`.`shipment_id` = `sh`.`shipment_id`)) left join `supplier` `s` on(`sh`.`supplier_id` = `s`.`supplier_id`)) GROUP BY cast(`d`.`created_at` as date) ;

-- --------------------------------------------------------

--
-- Structure for view `monthly_report`
--
DROP TABLE IF EXISTS `monthly_report`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `monthly_report`  AS SELECT month(`d`.`created_at`) AS `month_number`, year(`d`.`created_at`) AS `year`, count(distinct `s`.`supplier_id`) AS `total_suppliers`, count(distinct `sh`.`shipment_id`) AS `total_shipments`, count(distinct `d`.`delivery_id`) AS `total_deliveries`, sum(`d`.`quantity_delivered`) AS `total_quantity` FROM ((`delivery` `d` left join `shipment` `sh` on(`d`.`shipment_id` = `sh`.`shipment_id`)) left join `supplier` `s` on(`sh`.`supplier_id` = `s`.`supplier_id`)) GROUP BY month(`d`.`created_at`), year(`d`.`created_at`) ;

-- --------------------------------------------------------

--
-- Structure for view `weekly_report`
--
DROP TABLE IF EXISTS `weekly_report`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `weekly_report`  AS SELECT week(`d`.`created_at`) AS `week_number`, year(`d`.`created_at`) AS `year`, count(distinct `s`.`supplier_id`) AS `total_suppliers`, count(distinct `sh`.`shipment_id`) AS `total_shipments`, count(distinct `d`.`delivery_id`) AS `total_deliveries`, sum(`d`.`quantity_delivered`) AS `total_quantity` FROM ((`delivery` `d` left join `shipment` `sh` on(`d`.`shipment_id` = `sh`.`shipment_id`)) left join `supplier` `s` on(`sh`.`supplier_id` = `s`.`supplier_id`)) GROUP BY week(`d`.`created_at`), year(`d`.`created_at`) ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `delivery`
--
ALTER TABLE `delivery`
  ADD PRIMARY KEY (`delivery_id`),
  ADD UNIQUE KEY `delivery_code` (`delivery_code`),
  ADD KEY `shipment_id` (`shipment_id`);

--
-- Indexes for table `shipment`
--
ALTER TABLE `shipment`
  ADD PRIMARY KEY (`shipment_id`),
  ADD UNIQUE KEY `shipment_number` (`shipment_number`),
  ADD KEY `supplier_id` (`supplier_id`);

--
-- Indexes for table `supplier`
--
ALTER TABLE `supplier`
  ADD PRIMARY KEY (`supplier_id`),
  ADD UNIQUE KEY `supplier_code` (`supplier_code`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `delivery`
--
ALTER TABLE `delivery`
  MODIFY `delivery_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `shipment`
--
ALTER TABLE `shipment`
  MODIFY `shipment_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `supplier`
--
ALTER TABLE `supplier`
  MODIFY `supplier_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `delivery`
--
ALTER TABLE `delivery`
  ADD CONSTRAINT `delivery_ibfk_1` FOREIGN KEY (`shipment_id`) REFERENCES `shipment` (`shipment_id`) ON DELETE CASCADE;

--
-- Constraints for table `shipment`
--
ALTER TABLE `shipment`
  ADD CONSTRAINT `shipment_ibfk_1` FOREIGN KEY (`supplier_id`) REFERENCES `supplier` (`supplier_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
