require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// PostgreSQL Connection Pool (Neon)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Initialize DB table
async function initDb() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS certificates (
        id VARCHAR(100) PRIMARY KEY,
        image_path TEXT NOT NULL
      )
    `);
    console.log("Neon PostgreSQL database initialized: certificates table ready.");
  } catch (err) {
    console.error("Database initialization failed:", err);
  }
}
initDb();

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// GET: Search certificate by ID
app.get('/api/certificate/:id', async (req, res) => {
  try {
    let id = req.params.id.trim().toUpperCase();

    // Strip image extensions if accidentally included
    const extIndex = id.lastIndexOf('.');
    if (extIndex !== -1) {
      const ext = id.substring(extIndex).toLowerCase();
      if (['.png', '.jpg', '.jpeg', '.webp', '.gif'].includes(ext)) {
        id = id.substring(0, extIndex);
      }
    }

    const { rows } = await pool.query(
      "SELECT * FROM certificates WHERE UPPER(id) = $1", [id]
    );

    if (rows.length > 0) {
      res.json({ success: true, certificate: rows[0] });
    } else {
      res.status(404).json({ success: false, message: "Certificate ID not found in the registry." });
    }
  } catch (error) {
    console.error("Search Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST: Upload certificate image (admin)
app.post('/api/certificate', async (req, res) => {
  try {
    const { id, imageData } = req.body;

    if (!id || !imageData) {
      return res.status(400).json({ success: false, message: "Certificate ID and image data are required." });
    }

    const trimmedId = id.trim().toUpperCase();

    // Check if ID already exists
    const { rows: checkRows } = await pool.query(
      "SELECT * FROM certificates WHERE UPPER(id) = $1", [trimmedId]
    );
    const exists = checkRows.length > 0;

    // Decode Base64
    const matches = imageData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ success: false, message: "Invalid image format. Must be a valid Base64 data-URL." });
    }

    const mimeType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');

    // Determine extension
    let ext = 'png';
    if (mimeType.includes('jpeg') || mimeType.includes('jpg')) ext = 'jpg';
    else if (mimeType.includes('webp')) ext = 'webp';
    else if (mimeType.includes('gif')) ext = 'gif';
    else if (mimeType.includes('pdf')) ext = 'pdf';

    const fileName = `${trimmedId}.${ext}`;
    const relativePath = `/uploads/${fileName}`;
    const absolutePath = path.join(__dirname, 'public', 'uploads', fileName);

    // Ensure uploads directory exists
    const uploadsDir = path.join(__dirname, 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Save file
    fs.writeFileSync(absolutePath, buffer);

    // Save to DB
    if (exists) {
      await pool.query(
        "UPDATE certificates SET image_path = $1 WHERE UPPER(id) = $2",
        [relativePath, trimmedId]
      );
    } else {
      await pool.query(
        "INSERT INTO certificates (id, image_path) VALUES ($1, $2)",
        [trimmedId, relativePath]
      );
    }

    res.json({ success: true, message: "Certificate image successfully saved and registered." });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
