-- =====================================================
-- Certificate Project - Database Export
-- Generated: 2026-05-25T06:26:15.783Z
-- Host: Neon PostgreSQL (ap-southeast-1)
-- Database: neondb
-- =====================================================

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

-- ---------------------------------------------------
-- Table: certificates
-- ---------------------------------------------------
DROP TABLE IF EXISTS "certificates" CASCADE;
CREATE TABLE "certificates" (
  "id" VARCHAR(100) NOT NULL,
  "image_path" TEXT NOT NULL,
  PRIMARY KEY ("id")
);

-- Data: certificates (9 rows)
INSERT INTO "certificates" ("id", "image_path") VALUES ('CERT1001', '/background.png');
INSERT INTO "certificates" ("id", "image_path") VALUES ('CERT1002', '/background.png');
INSERT INTO "certificates" ("id", "image_path") VALUES ('TEST1', '/uploads/TEST1.png');
INSERT INTO "certificates" ("id", "image_path") VALUES ('CERTIFICATE', '/uploads/CERTIFICATE.png');
INSERT INTO "certificates" ("id", "image_path") VALUES ('DJX-2025-05-002157', '/uploads/DJX-2025-05-002157.png');
INSERT INTO "certificates" ("id", "image_path") VALUES ('CERTIFICATE H', '/uploads/CERTIFICATE H.png');
INSERT INTO "certificates" ("id", "image_path") VALUES ('DJX-WEB-2026-001', '/uploads/DJX-WEB-2026-001.png');
INSERT INTO "certificates" ("id", "image_path") VALUES ('DIV-GMS5GQTS02', '/uploads/DIV-GMS5GQTS02.pdf');
INSERT INTO "certificates" ("id", "image_path") VALUES ('DIVIJIX-JFS-2026-8XQ4M2', '/uploads/DIVIJIX-JFS-2026-8XQ4M2.png');

-- =====================================================
-- Export Complete ✓
-- To import: psql -U user -d dbname -f <this_file>
-- =====================================================
