require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const data = [
  { id: 'CERT1001', image_path: '/background.png' },
  { id: 'CERT1002', image_path: '/background.png' },
  { id: 'TEST1', image_path: '/uploads/TEST1.png' },
  { id: 'CERTIFICATE', image_path: '/uploads/CERTIFICATE.png' },
  { id: 'DJX-2025-05-002157', image_path: '/uploads/DJX-2025-05-002157.png' },
  { id: 'CERTIFICATE H', image_path: '/uploads/CERTIFICATE H.png' },
  { id: 'DJX-WEB-2026-001', image_path: '/uploads/DJX-WEB-2026-001.png' },
  { id: 'DIV-GMS5GQTS02', image_path: '/uploads/DIV-GMS5GQTS02.pdf' },
  { id: 'DIVIJIX-JFS-2026-8XQ4M2', image_path: '/uploads/DIVIJIX-JFS-2026-8XQ4M2.png' }
];

async function run() {
  try {
    await client.connect();
    console.log('🔌 Connected to Neon database...');

    // Create table if not exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS certificates (
        id VARCHAR(100) PRIMARY KEY,
        image_path TEXT NOT NULL
      )
    `);
    console.log('✓ Table "certificates" verified/created.');

    // Insert records
    for (const record of data) {
      await client.query(
        `INSERT INTO certificates (id, image_path) 
         VALUES ($1, $2) 
         ON CONFLICT (id) DO UPDATE SET image_path = EXCLUDED.image_path`,
        [record.id, record.image_path]
      );
      console.log(`✓ Saved: ${record.id} -> ${record.image_path}`);
    }

    console.log('\n🎉 Database successfully seeded with 9 certificates!');
  } catch (err) {
    console.error('❌ Import failed:', err);
  } finally {
    await client.end();
  }
}

run();
