const { pool } = require('../config/db');

exports.getAll = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM profil ORDER BY `key` ASC');
    // Convert array to object for easier frontend use
    const profil = {};
    rows.forEach(row => {
      profil[row.key] = row.value;
    });
    res.json(profil);
  } catch (error) {
    console.error('Get profil error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
};

exports.update = async (req, res) => {
  try {
    const { value } = req.body;
    const key = req.params.key;

    await pool.query(
      'INSERT INTO profil (`key`, value) VALUES (?, ?) ON DUPLICATE KEY UPDATE value = ?',
      [key, value, value]
    );

    res.json({ message: 'Profil berhasil diperbarui.' });
  } catch (error) {
    console.error('Update profil error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const [beritaCount] = await pool.query('SELECT COUNT(*) as total FROM berita');
    const [anggotaCount] = await pool.query('SELECT COUNT(*) as total FROM anggota');
    const [dokumenCount] = await pool.query('SELECT COUNT(*) as total FROM dokumen');
    const [aspirasiCount] = await pool.query('SELECT COUNT(*) as total FROM aspirasi');
    const [aspirasiMasuk] = await pool.query("SELECT COUNT(*) as total FROM aspirasi WHERE status = 'masuk'");
    const [aspirasiDiproses] = await pool.query("SELECT COUNT(*) as total FROM aspirasi WHERE status = 'diproses'");
    const [aspirasiSelesai] = await pool.query("SELECT COUNT(*) as total FROM aspirasi WHERE status = 'selesai'");

    const [recentBerita] = await pool.query('SELECT id, judul, created_at FROM berita ORDER BY created_at DESC LIMIT 5');
    const [recentAspirasi] = await pool.query('SELECT id, nama, kategori, status, created_at FROM aspirasi ORDER BY created_at DESC LIMIT 5');

    res.json({
      stats: {
        berita: beritaCount[0].total,
        anggota: anggotaCount[0].total,
        dokumen: dokumenCount[0].total,
        aspirasi: {
          total: aspirasiCount[0].total,
          masuk: aspirasiMasuk[0].total,
          diproses: aspirasiDiproses[0].total,
          selesai: aspirasiSelesai[0].total
        }
      },
      recent: {
        berita: recentBerita,
        aspirasi: recentAspirasi
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
};
