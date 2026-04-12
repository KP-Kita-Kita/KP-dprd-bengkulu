const { pool } = require('../config/db');

exports.create = async (req, res) => {
  try {
    const { nama, isi, kategori, email } = req.body;

    if (!isi) {
      return res.status(400).json({ message: 'Isi aspirasi wajib diisi.' });
    }

    const [result] = await pool.query(
      'INSERT INTO aspirasi (nama, isi, kategori, email) VALUES (?, ?, ?, ?)',
      [nama || 'Anonim', isi, kategori || 'umum', email || null]
    );

    res.status(201).json({
      message: 'Aspirasi berhasil dikirim. Terima kasih atas partisipasi Anda.',
      id: result.insertId
    });
  } catch (error) {
    console.error('Create aspirasi error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
};

exports.getAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const status = req.query.status;

    let query = 'SELECT * FROM aspirasi';
    let countQuery = 'SELECT COUNT(*) as total FROM aspirasi';
    const params = [];
    const countParams = [];

    if (status) {
      query += ' WHERE status = ?';
      countQuery += ' WHERE status = ?';
      params.push(status);
      countParams.push(status);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await pool.query(query, params);
    const [countRows] = await pool.query(countQuery, countParams);
    const total = countRows[0].total;

    res.json({
      data: rows,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    });
  } catch (error) {
    console.error('Get aspirasi error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status, catatan_admin } = req.body;
    const id = req.params.id;

    const validStatuses = ['masuk', 'diproses', 'selesai', 'ditolak'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Status tidak valid. Gunakan: masuk, diproses, selesai, atau ditolak.' });
    }

    const [existing] = await pool.query('SELECT * FROM aspirasi WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Aspirasi tidak ditemukan.' });
    }

    await pool.query(
      'UPDATE aspirasi SET status = ?, catatan_admin = ? WHERE id = ?',
      [status, catatan_admin || existing[0].catatan_admin, id]
    );

    res.json({ message: 'Status aspirasi berhasil diperbarui.' });
  } catch (error) {
    console.error('Update aspirasi status error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
};
