const { pool } = require('../config/db');
const fs = require('fs');
const path = require('path');

exports.getAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const kategori = req.query.kategori;
    const search = req.query.search;

    let query = 'SELECT b.*, u.nama_lengkap as author_nama FROM berita b LEFT JOIN users u ON b.author_id = u.id';
    let countQuery = 'SELECT COUNT(*) as total FROM berita b';
    const params = [];
    const countParams = [];

    const conditions = [];

    if (kategori) {
      conditions.push('b.kategori = ?');
      params.push(kategori);
      countParams.push(kategori);
    }

    if (search) {
      conditions.push('(b.judul LIKE ? OR b.konten LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
      countParams.push(`%${search}%`, `%${search}%`);
    }

    if (!req.user || req.query.admin !== 'true') {
      conditions.push('b.is_published = true');
    }

    if (conditions.length > 0) {
      const whereClause = ' WHERE ' + conditions.join(' AND ');
      query += whereClause;
      countQuery += whereClause;
    }

    query += ' ORDER BY b.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await pool.query(query, params);
    const [countRows] = await pool.query(countQuery, countParams);
    const total = countRows[0].total;

    res.json({
      data: rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get berita error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
};

exports.getById = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT b.*, u.nama_lengkap as author_nama FROM berita b LEFT JOIN users u ON b.author_id = u.id WHERE b.id = ?',
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Berita tidak ditemukan.' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Get berita by id error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
};

exports.create = async (req, res) => {
  try {
    const { judul, konten, kategori, is_published } = req.body;

    if (!judul || !konten) {
      return res.status(400).json({ message: 'Judul dan konten wajib diisi.' });
    }

    const gambar = req.file ? `/uploads/berita/${req.file.filename}` : null;

    const [result] = await pool.query(
      'INSERT INTO berita (judul, konten, gambar, kategori, author_id, is_published) VALUES (?, ?, ?, ?, ?, ?)',
      [judul, konten, gambar, kategori || 'umum', req.user.id, is_published !== 'false']
    );

    res.status(201).json({
      message: 'Berita berhasil ditambahkan.',
      id: result.insertId
    });
  } catch (error) {
    console.error('Create berita error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
};

exports.update = async (req, res) => {
  try {
    const { judul, konten, kategori, is_published } = req.body;
    const id = req.params.id;

    const [existing] = await pool.query('SELECT * FROM berita WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Berita tidak ditemukan.' });
    }

    let gambar = existing[0].gambar;
    if (req.file) {
      // Delete old image
      if (gambar) {
        const oldPath = path.join(__dirname, '..', gambar);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      gambar = `/uploads/berita/${req.file.filename}`;
    }

    await pool.query(
      'UPDATE berita SET judul = ?, konten = ?, gambar = ?, kategori = ?, is_published = ? WHERE id = ?',
      [judul || existing[0].judul, konten || existing[0].konten, gambar, kategori || existing[0].kategori, is_published !== undefined ? is_published !== 'false' : existing[0].is_published, id]
    );

    res.json({ message: 'Berita berhasil diperbarui.' });
  } catch (error) {
    console.error('Update berita error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
};

exports.delete = async (req, res) => {
  try {
    const [existing] = await pool.query('SELECT * FROM berita WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Berita tidak ditemukan.' });
    }

    // Delete image file
    if (existing[0].gambar) {
      const filePath = path.join(__dirname, '..', existing[0].gambar);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await pool.query('DELETE FROM berita WHERE id = ?', [req.params.id]);
    res.json({ message: 'Berita berhasil dihapus.' });
  } catch (error) {
    console.error('Delete berita error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
};
