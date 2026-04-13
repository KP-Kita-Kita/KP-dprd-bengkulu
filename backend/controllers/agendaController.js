const { pool } = require('../config/db');

// ==================== PUBLIC ====================

// GET /api/agenda/public — Ambil agenda untuk halaman publik (dengan filter bulan/range)
exports.getPublic = async (req, res) => {
  try {
    const { bulan, tahun, limit } = req.query;

    let query = `
      SELECT id, judul, deskripsi, waktu_mulai, waktu_selesai,
             lokasi, kategori, komisi, link_streaming, status
      FROM agenda
    `;
    const params = [];
    const conditions = [];

    // Filter berdasarkan bulan & tahun jika disertakan
    if (bulan && tahun) {
      conditions.push('MONTH(waktu_mulai) = ? AND YEAR(waktu_mulai) = ?');
      params.push(parseInt(bulan), parseInt(tahun));
    } else {
      // Default: tampilkan semua agenda yang belum lewat atau sedang berlangsung
      conditions.push('waktu_selesai >= NOW() - INTERVAL 1 DAY');
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY waktu_mulai ASC';

    if (limit) {
      query += ' LIMIT ?';
      params.push(parseInt(limit));
    }

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Get public agenda error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
};

// GET /api/agenda/public/terdekat — 3 agenda terdekat dari sekarang (untuk widget beranda)
exports.getTerdekat = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT id, judul, waktu_mulai, waktu_selesai, lokasi, kategori, komisi, status, link_streaming
      FROM agenda
      WHERE waktu_mulai >= NOW() AND status != 'Selesai' AND status != 'Ditunda'
      ORDER BY waktu_mulai ASC
      LIMIT 3
    `);
    res.json(rows);
  } catch (error) {
    console.error('Get agenda terdekat error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
};

// ==================== ADMIN ====================

// GET /api/agenda — Semua agenda (admin, dengan pagination & filter)
exports.getAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const { status, kategori, search, bulan, tahun } = req.query;

    let query = `
      SELECT a.*, u.nama_lengkap as created_by_nama
      FROM agenda a
      LEFT JOIN users u ON a.created_by = u.id
    `;
    let countQuery = 'SELECT COUNT(*) as total FROM agenda a';
    const params = [];
    const countParams = [];
    const conditions = [];

    if (status) {
      conditions.push('a.status = ?');
      params.push(status); countParams.push(status);
    }
    if (kategori) {
      conditions.push('a.kategori = ?');
      params.push(kategori); countParams.push(kategori);
    }
    if (search) {
      conditions.push('(a.judul LIKE ? OR a.lokasi LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
      countParams.push(`%${search}%`, `%${search}%`);
    }
    if (bulan && tahun) {
      conditions.push('MONTH(a.waktu_mulai) = ? AND YEAR(a.waktu_mulai) = ?');
      params.push(parseInt(bulan), parseInt(tahun));
      countParams.push(parseInt(bulan), parseInt(tahun));
    }

    if (conditions.length > 0) {
      const where = ' WHERE ' + conditions.join(' AND ');
      query += where;
      countQuery += where;
    }

    query += ' ORDER BY a.waktu_mulai DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await pool.query(query, params);
    const [countRows] = await pool.query(countQuery, countParams);
    const total = countRows[0].total;

    res.json({
      data: rows,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    });
  } catch (error) {
    console.error('Get agenda error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
};

// POST /api/agenda — Buat agenda baru
exports.create = async (req, res) => {
  try {
    const { judul, deskripsi, waktu_mulai, waktu_selesai, lokasi, kategori, komisi, link_streaming, status } = req.body;

    if (!judul || !waktu_mulai || !waktu_selesai) {
      return res.status(400).json({ message: 'Judul, waktu mulai, dan waktu selesai wajib diisi.' });
    }

    if (new Date(waktu_selesai) <= new Date(waktu_mulai)) {
      return res.status(400).json({ message: 'Waktu selesai harus setelah waktu mulai.' });
    }

    const validKategori = ['Agenda', 'Masa Sidang', 'Reses'];
    if (kategori && !validKategori.includes(kategori)) {
      return res.status(400).json({ message: 'Kategori tidak valid.' });
    }

    const validKomisi = ['Komisi I', 'Komisi II', 'Komisi III', 'Komisi IV'];
    if (komisi && !validKomisi.includes(komisi)) {
      return res.status(400).json({ message: 'Komisi tidak valid.' });
    }

    const [result] = await pool.query(
      `INSERT INTO agenda (judul, deskripsi, waktu_mulai, waktu_selesai, lokasi, kategori, komisi, link_streaming, status, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [judul, deskripsi || null, waktu_mulai, waktu_selesai, lokasi || null,
       kategori || 'Agenda', komisi || null, link_streaming || null, status || 'Menunggu', req.user.id]
    );

    res.status(201).json({ message: 'Agenda berhasil ditambahkan.', id: result.insertId });
  } catch (error) {
    console.error('Create agenda error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
};

// PUT /api/agenda/:id — Edit agenda
exports.update = async (req, res) => {
  try {
    const { judul, deskripsi, waktu_mulai, waktu_selesai, lokasi, kategori, komisi, link_streaming, status } = req.body;
    const id = req.params.id;

    const [existing] = await pool.query('SELECT * FROM agenda WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Agenda tidak ditemukan.' });
    }

    const ex = existing[0];
    const newMulai   = waktu_mulai   || ex.waktu_mulai;
    const newSelesai = waktu_selesai || ex.waktu_selesai;

    if (new Date(newSelesai) <= new Date(newMulai)) {
      return res.status(400).json({ message: 'Waktu selesai harus setelah waktu mulai.' });
    }

    await pool.query(
      `UPDATE agenda SET judul = ?, deskripsi = ?, waktu_mulai = ?, waktu_selesai = ?,
       lokasi = ?, kategori = ?, komisi = ?, link_streaming = ?, status = ? WHERE id = ?`,
      [
        judul             || ex.judul,
        deskripsi         !== undefined ? deskripsi         : ex.deskripsi,
        newMulai, newSelesai,
        lokasi            !== undefined ? lokasi            : ex.lokasi,
        kategori          || ex.kategori,
        komisi            !== undefined ? (komisi || null)  : ex.komisi,
        link_streaming    !== undefined ? link_streaming    : ex.link_streaming,
        status            || ex.status,
        id
      ]
    );

    res.json({ message: 'Agenda berhasil diperbarui.' });
  } catch (error) {
    console.error('Update agenda error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
};

// DELETE /api/agenda/:id — Hapus agenda
exports.delete = async (req, res) => {
  try {
    const [existing] = await pool.query('SELECT id FROM agenda WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Agenda tidak ditemukan.' });
    }

    await pool.query('DELETE FROM agenda WHERE id = ?', [req.params.id]);
    res.json({ message: 'Agenda berhasil dihapus.' });
  } catch (error) {
    console.error('Delete agenda error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
};
