/**
 * FTP Upload Script - Certificate Project
 * Uploads all files to cPanel hosting
 */
const ftp = require('basic-ftp');
const path = require('path');

const LOCAL_DIR  = 'D:/certificate';
const REMOTE_DIR = '/public_html/Certificate';

const CONFIGS = [
  { label: 'FTP Port 21',        port: 21,  secure: false },
  { label: 'FTPS Port 990',      port: 990, secure: true  },
  { label: 'FTP Port 21 (TLS)',  port: 21,  secure: 'implicit' },
];

async function tryUpload(config) {
  const client = new ftp.Client(30000);
  client.ftp.verbose = false;

  try {
    console.log(`🔌 Trying: ${config.label}...`);
    await client.access({
      host: '46.28.45.15',
      port: config.port,
      user: 'u759861691',
      password: 'NeedyGo@321',
      secure: config.secure,
      secureOptions: { rejectUnauthorized: false }
    });

    console.log('✅ Connected!\n');
    await client.ensureDir(REMOTE_DIR);
    console.log(`📂 Remote dir ready: ${REMOTE_DIR}\n`);

    const rootFiles = ['server.js', '.env', 'package.json', 'package-lock.json', 'mysql_import.sql'];
    for (const file of rootFiles) {
      const localPath = path.join(LOCAL_DIR, file);
      console.log(`📤 Uploading: ${file}`);
      await client.uploadFrom(localPath, file);
      console.log(`   ✓ Done`);
    }

    console.log('\n📤 Uploading public/ folder...');
    await client.uploadFromDir(path.join(LOCAL_DIR, 'public'), 'public');
    console.log('   ✓ Done\n');

    console.log('📤 Uploading api/ folder...');
    await client.uploadFromDir(path.join(LOCAL_DIR, 'api'), 'api');
    console.log('   ✓ Done\n');

    console.log('🎉 All files uploaded successfully!');
    return true;
  } catch (err) {
    console.log(`   ✗ Failed: ${err.message}`);
    return false;
  } finally {
    client.close();
  }
}

async function main() {
  for (const config of CONFIGS) {
    const ok = await tryUpload(config);
    if (ok) break;
    console.log('');
  }
}

main();
