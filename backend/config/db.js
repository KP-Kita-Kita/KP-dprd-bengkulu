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
      komisi VARCHAR(50),
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
      status VARCHAR(20) DEFAULT 'masuk',
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

  db.release();
  console.log('✅ Database tables initialized');
};

module.exports = { pool, initDatabase };
