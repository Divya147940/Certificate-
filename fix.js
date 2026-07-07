const fs = require('fs');
fs.renameSync('public/uploads/DIV-GMS5GQTS02.png', 'public/uploads/DIV-GMS5GQTS02.pdf');
require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});
pool.query("UPDATE certificates SET image_path='/uploads/DIV-GMS5GQTS02.pdf' WHERE id='DIV-GMS5GQTS02'")
  .then(() => pool.end());
