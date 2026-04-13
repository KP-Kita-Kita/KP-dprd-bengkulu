const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'dprd_bengkulu',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Helper: safely add column if not exists
const addColumnIfNotExists = async (db, table, column, definition) => {
  try {
    const [cols] = await db.query(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
      [process.env.DB_NAME || 'dprd_bengkulu', table, column]
    );
    if (cols.length === 0) {
      await db.query(`ALTER TABLE \`${table}\` ADD COLUMN \`${column}\` ${definition}`);
      console.log(`  ✅ Column ${table}.${column} added`);
    }
  } catch (err) {
    console.log(`  ⚠️ Column ${table}.${column} skipped: ${err.message}`);
  }
};

// Initialize database tables
const initDatabase = async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || ''
  });

  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'dprd_bengkulu'}\``);
  await connection.end();

  const db = await pool.getConnection();

  // ===== EXISTING TABLES =====

  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      nama_lengkap VARCHAR(100) NOT NULL,
      role VARCHAR(20) DEFAULT 'admin',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS berita (
      id INT AUTO_INCREMENT PRIMARY KEY,
      judul VARCHAR(255) NOT NULL,
      konten TEXT NOT NULL,
      gambar VARCHAR(255),
      kategori VARCHAR(50) DEFAULT 'umum',
      author_id INT,
      is_published BOOLEAN DEFAULT true,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS anggota (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nama VARCHAR(100) NOT NULL,
      jabatan VARCHAR(100),
      dapil VARCHAR(100),
      daerah_pemilihan VARCHAR(100),
      fraksi VARCHAR(100),
      foto VARCHAR(255),
      bio TEXT,
      periode VARCHAR(20) DEFAULT '2024-2029',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS kategori_dokumen (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nama VARCHAR(100) UNIQUE NOT NULL,
      deskripsi VARCHAR(255)
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS dokumen (
      id INT AUTO_INCREMENT PRIMARY KEY,
      judul VARCHAR(255) NOT NULL,
      deskripsi TEXT,
      file_path VARCHAR(255) NOT NULL,
      kategori_id INT,
      tahun VARCHAR(4),
      uploaded_by INT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (kategori_id) REFERENCES kategori_dokumen(id) ON DELETE SET NULL,
      FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS aspirasi (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nama VARCHAR(100) DEFAULT 'Anonim',
      isi TEXT NOT NULL,
      kategori VARCHAR(50) DEFAULT 'umum',
      email VARCHAR(100),
      status VARCHAR(20) DEFAULT 'pending',
      catatan_admin TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS profil (
      id INT AUTO_INCREMENT PRIMARY KEY,
      \`key\` VARCHAR(50) UNIQUE NOT NULL,
      value TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS agenda (
      id INT AUTO_INCREMENT PRIMARY KEY,
      judul VARCHAR(255) NOT NULL,
      deskripsi TEXT,
      waktu_mulai DATETIME NOT NULL,
      waktu_selesai DATETIME NOT NULL,
      lokasi VARCHAR(255),
      kategori ENUM('Agenda', 'Masa Sidang', 'Reses') DEFAULT 'Agenda',
      komisi ENUM('Komisi I', 'Komisi II', 'Komisi III', 'Komisi IV') NULL,
      link_streaming VARCHAR(500),
      status ENUM('Menunggu', 'Berlangsung', 'Selesai', 'Ditunda') DEFAULT 'Menunggu',
      created_by INT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
    )
  `);

  // ===== NEW TABLES FOR ASPIRASI WILAYAH =====

  await db.query(`
    CREATE TABLE IF NOT EXISTS dapil (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nama VARCHAR(100) UNIQUE NOT NULL,
      deskripsi VARCHAR(255),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS dapil_wilayah (
      id INT AUTO_INCREMENT PRIMARY KEY,
      dapil_id INT NOT NULL,
      kabupaten_id VARCHAR(10) NOT NULL,
      kabupaten_nama VARCHAR(100) NOT NULL,
      FOREIGN KEY (dapil_id) REFERENCES dapil(id) ON DELETE CASCADE,
      UNIQUE KEY unique_kab (kabupaten_id)
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS dapil_anggota (
      id INT AUTO_INCREMENT PRIMARY KEY,
      dapil_id INT NOT NULL,
      anggota_id INT NOT NULL,
      FOREIGN KEY (dapil_id) REFERENCES dapil(id) ON DELETE CASCADE,
      FOREIGN KEY (anggota_id) REFERENCES anggota(id) ON DELETE CASCADE,
      UNIQUE KEY unique_dapil_anggota (dapil_id, anggota_id)
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS aspirasi_dewan (
      id INT AUTO_INCREMENT PRIMARY KEY,
      aspirasi_id INT NOT NULL,
      anggota_id INT NOT NULL,
      dibaca BOOLEAN DEFAULT false,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (aspirasi_id) REFERENCES aspirasi(id) ON DELETE CASCADE,
      FOREIGN KEY (anggota_id) REFERENCES anggota(id) ON DELETE CASCADE,
      UNIQUE KEY unique_aspirasi_anggota (aspirasi_id, anggota_id)
    )
  `);

  // ===== ALTER EXISTING TABLES =====

  // Add wilayah columns to aspirasi
  await addColumnIfNotExists(db, 'aspirasi', 'kabupaten_id', 'VARCHAR(10) NULL');
  await addColumnIfNotExists(db, 'aspirasi', 'kabupaten_nama', 'VARCHAR(100) NULL');
  await addColumnIfNotExists(db, 'aspirasi', 'kecamatan_id', 'VARCHAR(10) NULL');
  await addColumnIfNotExists(db, 'aspirasi', 'kecamatan_nama', 'VARCHAR(100) NULL');
  await addColumnIfNotExists(db, 'aspirasi', 'kelurahan_id', 'VARCHAR(10) NULL');
  await addColumnIfNotExists(db, 'aspirasi', 'kelurahan_nama', 'VARCHAR(100) NULL');
  await addColumnIfNotExists(db, 'aspirasi', 'lampiran', 'VARCHAR(255) NULL');
  await addColumnIfNotExists(db, 'aspirasi', 'dapil_id', 'INT NULL');

  // Add anggota_id to users (for dewan role linking)
  await addColumnIfNotExists(db, 'users', 'anggota_id', 'INT NULL');

  // Agenda: migrasi kategori lama → baru
  try {
    // Langkah 1: Ubah ke VARCHAR agar bisa menampung nilai baru
    await db.query("ALTER TABLE agenda MODIFY COLUMN kategori VARCHAR(50) DEFAULT 'Agenda'");

    // Langkah 2: Update nilai data lama ke kategori baru
    await db.query("UPDATE agenda SET kategori = 'Agenda' WHERE kategori IN ('Paripurna', 'RDP', 'Internal', 'Kunker')");

    // Langkah 3: Ubah kembali ke ENUM baru
    await db.query("ALTER TABLE agenda MODIFY COLUMN kategori ENUM('Agenda', 'Masa Sidang', 'Reses') DEFAULT 'Agenda'");

    console.log('  ✅ Agenda kategori ENUM migrated successfully');
  } catch (e) {
    console.log('  ⚠️ Agenda kategori migration skipped:', e.message);
  }
  await addColumnIfNotExists(db, 'agenda', 'komisi', "ENUM('Komisi I', 'Komisi II', 'Komisi III', 'Komisi IV') NULL");

  // Handle rename komisi to dapil if komisi exists
  try {
    const [cols] = await db.query("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'anggota' AND COLUMN_NAME = 'komisi'", [process.env.DB_NAME || 'dprd_bengkulu']);
    if (cols.length > 0) {
      await db.query("ALTER TABLE anggota CHANGE komisi dapil VARCHAR(100)");
      console.log("  ✅ Column komisi renamed to dapil in anggota table");
    }
  } catch (err) {
    console.log("  ⚠️ Rename komisi skipped: " + err.message);
  }

  // ===== SEED DAPIL DATA =====
  await seedDapilData(db);

  db.release();
  console.log('✅ Database tables initialized');
};

// Auto-seed 7 Dapil Bengkulu + mapping wilayah
const seedDapilData = async (db) => {
  const [existing] = await db.query('SELECT COUNT(*) as total FROM dapil');
  if (existing[0].total > 0) return; // Already seeded

  const dapilData = [
    {
      nama: 'Bengkulu 1',
      deskripsi: 'Kota Bengkulu',
      wilayah: [{ id: '1771', nama: 'KOTA BENGKULU' }]
    },
    {
      nama: 'Bengkulu 2',
      deskripsi: 'Kab. Bengkulu Utara & Kab. Bengkulu Tengah',
      wilayah: [
        { id: '1703', nama: 'KABUPATEN BENGKULU UTARA' },
        { id: '1709', nama: 'KABUPATEN BENGKULU TENGAH' }
      ]
    },
    {
      nama: 'Bengkulu 3',
      deskripsi: 'Kab. Mukomuko',
      wilayah: [{ id: '1706', nama: 'KABUPATEN MUKOMUKO' }]
    },
    {
      nama: 'Bengkulu 4',
      deskripsi: 'Kab. Rejang Lebong & Kab. Lebong',
      wilayah: [
        { id: '1702', nama: 'KABUPATEN REJANG LEBONG' },
        { id: '1707', nama: 'KABUPATEN LEBONG' }
      ]
    },
    {
      nama: 'Bengkulu 5',
      deskripsi: 'Kab. Kepahiang',
      wilayah: [{ id: '1708', nama: 'KABUPATEN KEPAHIANG' }]
    },
    {
      nama: 'Bengkulu 6',
      deskripsi: 'Kab. Bengkulu Selatan & Kab. Kaur',
      wilayah: [
        { id: '1701', nama: 'KABUPATEN BENGKULU SELATAN' },
        { id: '1704', nama: 'KABUPATEN KAUR' }
      ]
    },
    {
      nama: 'Bengkulu 7',
      deskripsi: 'Kab. Seluma',
      wilayah: [{ id: '1705', nama: 'KABUPATEN SELUMA' }]
    }
  ];

  for (const dapil of dapilData) {
    const [result] = await db.query(
      'INSERT INTO dapil (nama, deskripsi) VALUES (?, ?)',
      [dapil.nama, dapil.deskripsi]
    );
    const dapilId = result.insertId;

    for (const wil of dapil.wilayah) {
      await db.query(
        'INSERT INTO dapil_wilayah (dapil_id, kabupaten_id, kabupaten_nama) VALUES (?, ?, ?)',
        [dapilId, wil.id, wil.nama]
      );
    }
  }

  console.log('✅ Dapil data seeded (7 dapil Bengkulu)');
};

module.exports = { pool, initDatabase };
