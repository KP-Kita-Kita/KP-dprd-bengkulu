const { pool } = require('../config/db');
const fs = require('fs');
const path = require('path');

// Kategori
exports.getKategori = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM kategori_dokumen ORDER BY nama ASC');
    res.json(rows);
  } catch (error) {
    console.error('Get kategori error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
};

exports.createKategori = async (req, res) => {
  try {
    const { nama, deskripsi } = req.body;
    if (!nama) {
      return res.status(400).json({ message: 'Nama kategori wajib diisi.' });
    }

    const [result] = await pool.query(
      'INSERT INTO kategori_dokumen (nama, deskripsi) VALUES (?, ?)',
      [nama, deskripsi || null]
    );

    res.status(201).json({ message: 'Kategori berhasil ditambahkan.', id: result.insertId });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Kategori dengan nama tersebut sudah ada.' });
    }
    console.error('Create kategori error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
};

// Dokumen
exports.getAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const { kategori_id, tahun, search, sort } = req.query;

    let query = 'SELECT d.*, k.nama as kategori_nama, u.nama_lengkap as uploaded_by_nama FROM dokumen d LEFT JOIN kategori_dokumen k ON d.kategori_id = k.id LEFT JOIN users u ON d.uploaded_by = u.id';
    let countQuery = 'SELECT COUNT(*) as total FROM dokumen d';
    const params = [];
    const countParams = [];
    const conditions = [];

    if (kategori_id) {
      conditions.push('d.kategori_id = ?');
      params.push(kategori_id);
      countParams.push(kategori_id);
    }
    if (tahun) {
      conditions.push('d.tahun = ?');
      params.push(tahun);
      countParams.push(tahun);
    }
    if (search) {
      conditions.push('(d.judul LIKE ? OR d.deskripsi LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
      countParams.push(`%${search}%`, `%${search}%`);
    }

    if (conditions.length > 0) {
      const whereClause = ' WHERE ' + conditions.join(' AND ');
      query += whereClause;
      countQuery += whereClause;
    }

    // Sorting
    let orderClause = ' ORDER BY d.created_at DESC'; // default: terbaru
    if (sort === 'oldest') orderClause = ' ORDER BY d.created_at ASC';
    else if (sort === 'title') orderClause = ' ORDER BY d.judul ASC';
    query += orderClause;

    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await pool.query(query, params);
    const [countRows] = await pool.query(countQuery, countParams);
    const total = countRows[0].total;

    // Tambahkan file_size dari filesystem jika tersedia
    const enrichedRows = rows.map(row => {
      let file_size = null;
      if (row.file_path) {
        try {
          const fullPath = path.join(__dirname, '..', row.file_path);
          if (fs.existsSync(fullPath)) {
            const stats = fs.statSync(fullPath);
            file_size = stats.size; // dalam bytes
          }
        } catch (e) { /* skip */ }
      }
      return { ...row, file_size };
    });

    res.json({
      data: enrichedRows,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    });
  } catch (error) {
    console.error('Get dokumen error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
};

exports.create = async (req, res) => {
  try {
    const { judul, deskripsi, kategori_id, tahun } = req.body;

    if (!judul || !req.file) {
      return res.status(400).json({ message: 'Judul dan file dokumen wajib diisi.' });
    }

    const file_path = `/uploads/dokumen/${req.file.filename}`;

    const [result] = await pool.query(
      'INSERT INTO dokumen (judul, deskripsi, file_path, kategori_id, tahun, uploaded_by) VALUES (?, ?, ?, ?, ?, ?)',
      [judul, deskripsi, file_path, kategori_id || null, tahun, req.user.id]
    );

    res.status(201).json({ message: 'Dokumen berhasil diupload.', id: result.insertId });
  } catch (error) {
    console.error('Create dokumen error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
};

exports.update = async (req, res) => {
  try {
    const { judul, deskripsi, kategori_id, tahun } = req.body;
    const id = req.params.id;

    const [existing] = await pool.query('SELECT * FROM dokumen WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Dokumen tidak ditemukan.' });
    }

    let file_path = existing[0].file_path;
    if (req.file) {
      const oldPath = path.join(__dirname, '..', file_path);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      file_path = `/uploads/dokumen/${req.file.filename}`;
    }

    await pool.query(
      'UPDATE dokumen SET judul = ?, deskripsi = ?, file_path = ?, kategori_id = ?, tahun = ? WHERE id = ?',
      [judul || existing[0].judul, deskripsi || existing[0].deskripsi, file_path, kategori_id || existing[0].kategori_id, tahun || existing[0].tahun, id]
    );

    res.json({ message: 'Dokumen berhasil diperbarui.' });
  } catch (error) {
    console.error('Update dokumen error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
};

exports.delete = async (req, res) => {
  try {
    const [existing] = await pool.query('SELECT * FROM dokumen WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Dokumen tidak ditemukan.' });
    }

    const filePath = path.join(__dirname, '..', existing[0].file_path);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await pool.query('DELETE FROM dokumen WHERE id = ?', [req.params.id]);
    res.json({ message: 'Dokumen berhasil dihapus.' });
  } catch (error) {
    console.error('Delete dokumen error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
};
