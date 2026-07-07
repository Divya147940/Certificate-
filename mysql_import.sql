-- =====================================================
-- Certificate Project - MySQL Import File
-- Run this in cPanel > phpMyAdmin
-- Database: u759861691_Certificate
-- =====================================================

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- Create table
CREATE TABLE IF NOT EXISTS `certificates` (
  `id` VARCHAR(100) NOT NULL,
  `image_path` TEXT NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Clear existing data (safe re-import)
TRUNCATE TABLE `certificates`;

-- Insert all certificates
INSERT INTO `certificates` (`id`, `image_path`) VALUES ('CERT1001', '/background.png');
INSERT INTO `certificates` (`id`, `image_path`) VALUES ('CERT1002', '/background.png');
INSERT INTO `certificates` (`id`, `image_path`) VALUES ('TEST1', '/uploads/TEST1.png');
INSERT INTO `certificates` (`id`, `image_path`) VALUES ('CERTIFICATE', '/uploads/CERTIFICATE.png');
INSERT INTO `certificates` (`id`, `image_path`) VALUES ('DJX-2025-05-002157', '/uploads/DJX-2025-05-002157.png');
INSERT INTO `certificates` (`id`, `image_path`) VALUES ('CERTIFICATE H', '/uploads/CERTIFICATE H.png');
INSERT INTO `certificates` (`id`, `image_path`) VALUES ('DJX-WEB-2026-001', '/uploads/DJX-WEB-2026-001.png');
INSERT INTO `certificates` (`id`, `image_path`) VALUES ('DIV-GMS5GQTS02', '/uploads/DIV-GMS5GQTS02.pdf');
INSERT INTO `certificates` (`id`, `image_path`) VALUES ('DIVIJIX-JFS-2026-8XQ4M2', '/uploads/DIVIJIX-JFS-2026-8XQ4M2.png');

-- =====================================================
-- Import Complete ✓  (9 records)
-- =====================================================
