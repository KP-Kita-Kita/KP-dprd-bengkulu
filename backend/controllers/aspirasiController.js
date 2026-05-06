const { pool } = require('../config/db');
const fs = require('fs');
const path = require('path');

// ==================== PUBLIC ====================

// POST /api/aspirasi — Submit aspirasi baru (public)
exports.create = async (req, res) => {
  try {
    const { nama, isi, kategori, email, kabupaten_id, kabupaten_nama, kecamatan_id, kecamatan_nama, kelurahan_id, kelurahan_nama } = req.body;

    // Validasi field wajib
    if (!nama || !nama.trim()) {
      return res.status(400).json({ message: 'Nama wajib diisi.' });
    }
    if (!isi || !isi.trim()) {
      return res.status(400).json({ message: 'Isi aspirasi wajib diisi.' });
    }
    if (!kabupaten_id || !kecamatan_id || !kelurahan_id) {
      return res.status(400).json({ message: 'Wilayah (kabupaten, kecamatan, kelurahan) wajib dipilih.' });
    }

    // Validasi kategori
    const validKategori = ['umum', 'infrastruktur', 'pendidikan', 'kesehatan', 'pengawasan', 'lainnya'];
    if (kategori && !validKategori.includes(kategori)) {
      return res.status(400).json({ message: 'Kategori tidak valid.' });
    }

    // Cari dapil berdasarkan kabupaten_id
    const [dapilRows] = await pool.query(
      'SELECT dw.dapil_id FROM dapil_wilayah dw WHERE dw.kabupaten_id = ?',
      [kabupaten_id]
    );
    const dapilId = dapilRows.length > 0 ? dapilRows[0].dapil_id : null;

    // Path lampiran jika ada
    const lampiran = req.file ? `/uploads/aspirasi/${req.file.filename}` : null;

    // Insert aspirasi
    const [result] = await pool.query(
      `INSERT INTO aspirasi (nama, isi, kategori, email, kabupaten_id, kabupaten_nama, 
       kecamatan_id, kecamatan_nama, kelurahan_id, kelurahan_nama, lampiran, dapil_id, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [nama.trim(), isi.trim(), kategori || 'umum', email || null,
       kabupaten_id, kabupaten_nama || null, kecamatan_id, kecamatan_nama || null,
       kelurahan_id, kelurahan_nama || null, lampiran, dapilId]
    );
    const aspirasiId = result.insertId;

    // Distribusi otomatis ke dewan dalam dapil tersebut
    if (dapilId) {
      const [anggotaDapil] = await pool.query(
        'SELECT anggota_id FROM dapil_anggota WHERE dapil_id = ?',
        [dapilId]
      );
      for (const row of anggotaDapil) {
        await pool.query(
          'INSERT INTO aspirasi_dewan (aspirasi_id, anggota_id) VALUES (?, ?)',
          [aspirasiId, row.anggota_id]
        );
      }
    }

    res.status(201).json({
      message: 'Aspirasi berhasil dikirim. Terima kasih atas partisipasi Anda.',
      id: aspirasiId
    });
  } catch (error) {
    console.error('Create aspirasi error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
};

// ==================== ADMIN ====================

// GET /api/aspirasi — Lihat semua aspirasi (admin)
exports.getAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const { status, kategori, kabupaten_id, dapil_id, anggota_id, search, date_from, date_to } = req.query;

    let query = 'SELECT a.*, d.nama as dapil_nama FROM aspirasi a LEFT JOIN dapil d ON a.dapil_id = d.id';
    let countQuery = 'SELECT COUNT(*) as total FROM aspirasi a LEFT JOIN dapil d ON a.dapil_id = d.id';
    const params = [];
    const countParams = [];
    const conditions = [];

    if (status) {
      conditions.push('a.status = ?');
      params.push(status);
      countParams.push(status);
    }
    if (kategori) {
      conditions.push('a.kategori = ?');
      params.push(kategori);
      countParams.push(kategori);
    }
    if (kabupaten_id) {
      conditions.push('a.kabupaten_id = ?');
      params.push(kabupaten_id);
      countParams.push(kabupaten_id);
    }
    if (dapil_id) {
      conditions.push('a.dapil_id = ?');
      params.push(dapil_id);
      countParams.push(dapil_id);
    }
    if (anggota_id) {
      conditions.push('a.id IN (SELECT aspirasi_id FROM aspirasi_dewan WHERE anggota_id = ?)');
      params.push(anggota_id);
      countParams.push(anggota_id);
    }
    if (search) {
      conditions.push('(a.isi LIKE ? OR a.nama LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
      countParams.push(`%${search}%`, `%${search}%`);
    }
    if (date_from) {
      conditions.push('a.created_at >= ?');
      params.push(date_from);
      countParams.push(date_from);
    }
    if (date_to) {
      conditions.push('a.created_at <= ?');
      params.push(date_to + ' 23:59:59');
      countParams.push(date_to + ' 23:59:59');
    }

    if (conditions.length > 0) {
      const whereClause = ' WHERE ' + conditions.join(' AND ');
      query += whereClause;
      countQuery += whereClause;
    }

    query += ' ORDER BY a.created_at DESC LIMIT ? OFFSET ?';
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

// PUT /api/aspirasi/:id/status — Update status (admin)
exports.updateStatus = async (req, res) => {
  try {
    const { status, catatan_admin } = req.body;
    const id = req.params.id;

    const validStatuses = ['pending', 'diproses', 'selesai', 'ditolak'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Status tidak valid.' });
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

// DELETE /api/aspirasi/:id — Delete aspirasi (admin)
exports.remove = async (req, res) => {
  try {
    const id = req.params.id;
    const [existing] = await pool.query('SELECT lampiran FROM aspirasi WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Aspirasi tidak ditemukan.' });
    }

    // Delete lampiran file if exists
    if (existing[0].lampiran) {
      const filePath = path.join(__dirname, '..', existing[0].lampiran);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await pool.query('DELETE FROM aspirasi WHERE id = ?', [id]);
    res.json({ message: 'Aspirasi berhasil dihapus.' });
  } catch (error) {
    console.error('Delete aspirasi error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
};

// GET /api/aspirasi/stats — Statistik aspirasi
exports.getStats = async (req, res) => {
  try {
    const [total] = await pool.query('SELECT COUNT(*) as total FROM aspirasi');
    const [byStatus] = await pool.query(
      'SELECT status, COUNT(*) as count FROM aspirasi GROUP BY status'
    );
    const [byDapil] = await pool.query(
      `SELECT d.nama as dapil, COUNT(*) as count FROM aspirasi a
       JOIN dapil d ON a.dapil_id = d.id GROUP BY a.dapil_id ORDER BY count DESC`
    );
    const [byKategori] = await pool.query(
      'SELECT kategori, COUNT(*) as count FROM aspirasi GROUP BY kategori ORDER BY count DESC'
    );

    const statusMap = { pending: 0, diproses: 0, selesai: 0, ditolak: 0 };
    byStatus.forEach(row => { statusMap[row.status] = row.count; });

    res.json({
      total: total[0].total,
      byStatus: statusMap,
      byDapil,
      byKategori
    });
  } catch (error) {
    console.error('Get aspirasi stats error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
};

// ==================== DEWAN ====================

// GET /api/aspirasi/dewan — Aspirasi yang di-assign ke dewan yang login
exports.getDewan = async (req, res) => {
  try {
    const anggotaId = req.user.anggota_id;
    if (!anggotaId) {
      return res.status(400).json({ message: 'Akun Anda belum terhubung dengan data anggota DPRD.' });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const { status, kategori, kabupaten_id, search, date_from, date_to } = req.query;

    let query = `SELECT a.*, d.nama as dapil_nama, ad.dibaca
                 FROM aspirasi a
                 JOIN aspirasi_dewan ad ON a.id = ad.aspirasi_id
                 LEFT JOIN dapil d ON a.dapil_id = d.id
                 WHERE ad.anggota_id = ?`;
    let countQuery = `SELECT COUNT(*) as total
                      FROM aspirasi a
                      JOIN aspirasi_dewan ad ON a.id = ad.aspirasi_id
                      WHERE ad.anggota_id = ?`;
    const params = [anggotaId];
    const countParams = [anggotaId];

    if (status) {
      query += ' AND a.status = ?';
      countQuery += ' AND a.status = ?';
      params.push(status);
      countParams.push(status);
    }
    if (kategori) {
      query += ' AND a.kategori = ?';
      countQuery += ' AND a.kategori = ?';
      params.push(kategori);
      countParams.push(kategori);
    }
    if (kabupaten_id) {
      query += ' AND a.kabupaten_id = ?';
      countQuery += ' AND a.kabupaten_id = ?';
      params.push(kabupaten_id);
      countParams.push(kabupaten_id);
    }
    if (search) {
      query += ' AND (a.isi LIKE ? OR a.nama LIKE ?)';
      countQuery += ' AND (a.isi LIKE ? OR a.nama LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
      countParams.push(`%${search}%`, `%${search}%`);
    }
    if (date_from) {
      query += ' AND a.created_at >= ?';
      countQuery += ' AND a.created_at >= ?';
      params.push(date_from);
      countParams.push(date_from);
    }
    if (date_to) {
      query += ' AND a.created_at <= ?';
      countQuery += ' AND a.created_at <= ?';
      params.push(date_to + ' 23:59:59');
      countParams.push(date_to + ' 23:59:59');
    }

    query += ' ORDER BY a.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await pool.query(query, params);
    const [countRows] = await pool.query(countQuery, countParams);
    const total = countRows[0].total;

    res.json({
      data: rows,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    });
  } catch (error) {
    console.error('Get dewan aspirasi error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
};

// GET /api/aspirasi/dewan/stats — Statistik untuk dashboard dewan
exports.getDewanStats = async (req, res) => {
  try {
    const anggotaId = req.user.anggota_id;
    if (!anggotaId) {
      return res.status(400).json({ message: 'Akun belum terhubung dengan data anggota.' });
    }

    const [total] = await pool.query(
      'SELECT COUNT(*) as total FROM aspirasi_dewan WHERE anggota_id = ?', [anggotaId]
    );
    const [byStatus] = await pool.query(
      `SELECT a.status, COUNT(*) as count FROM aspirasi a
       JOIN aspirasi_dewan ad ON a.id = ad.aspirasi_id
       WHERE ad.anggota_id = ? GROUP BY a.status`, [anggotaId]
    );
    const [belumDibaca] = await pool.query(
      'SELECT COUNT(*) as total FROM aspirasi_dewan WHERE anggota_id = ? AND dibaca = false',
      [anggotaId]
    );

    const statusMap = { pending: 0, diproses: 0, selesai: 0, ditolak: 0 };
    byStatus.forEach(row => { statusMap[row.status] = row.count; });

    res.json({
      total: total[0].total,
      belumDibaca: belumDibaca[0].total,
      byStatus: statusMap
    });
  } catch (error) {
    console.error('Get dewan stats error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
};

// PUT /api/aspirasi/:id/dewan-status — Dewan update status
exports.updateDewanStatus = async (req, res) => {
  try {
    const anggotaId = req.user.anggota_id;
    const aspirasiId = req.params.id;
    const { status } = req.body;

    if (!anggotaId) {
      return res.status(400).json({ message: 'Akun belum terhubung dengan data anggota.' });
    }

    // Pastikan aspirasi ini memang di-assign ke dewan ini
    const [assigned] = await pool.query(
      'SELECT * FROM aspirasi_dewan WHERE aspirasi_id = ? AND anggota_id = ?',
      [aspirasiId, anggotaId]
    );
    if (assigned.length === 0) {
      return res.status(403).json({ message: 'Anda tidak memiliki akses ke aspirasi ini.' });
    }

    const validStatuses = ['pending', 'diproses', 'selesai', 'ditolak'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Status tidak valid.' });
    }

    // Update status aspirasi
    await pool.query('UPDATE aspirasi SET status = ? WHERE id = ?', [status, aspirasiId]);

    // Tandai sebagai dibaca
    await pool.query(
      'UPDATE aspirasi_dewan SET dibaca = true WHERE aspirasi_id = ? AND anggota_id = ?',
      [aspirasiId, anggotaId]
    );

    res.json({ message: 'Status aspirasi berhasil diperbarui.' });
  } catch (error) {
    console.error('Update dewan status error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
};

// ==================== EXPORT ====================

// GET /api/aspirasi/export — Export ke Excel
exports.exportExcel = async (req, res) => {
  try {
    const ExcelJS = require('exceljs');
    const { status, kabupaten_id, dapil_id, date_from, date_to } = req.query;

    let query = 'SELECT a.*, d.nama as dapil_nama FROM aspirasi a LEFT JOIN dapil d ON a.dapil_id = d.id';
    const params = [];
    const conditions = [];

    if (status) { conditions.push('a.status = ?'); params.push(status); }
    if (kabupaten_id) { conditions.push('a.kabupaten_id = ?'); params.push(kabupaten_id); }
    if (dapil_id) { conditions.push('a.dapil_id = ?'); params.push(dapil_id); }
    if (date_from) { conditions.push('a.created_at >= ?'); params.push(date_from); }
    if (date_to) { conditions.push('a.created_at <= ?'); params.push(date_to + ' 23:59:59'); }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    query += ' ORDER BY a.created_at DESC';

    const [rows] = await pool.query(query, params);

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Data Aspirasi');

    sheet.columns = [
      { header: 'No', key: 'no', width: 5 },
      { header: 'Tanggal', key: 'tanggal', width: 15 },
      { header: 'Nama', key: 'nama', width: 20 },
      { header: 'Kategori', key: 'kategori', width: 15 },
      { header: 'Isi Aspirasi', key: 'isi', width: 50 },
      { header: 'Kabupaten/Kota', key: 'kabupaten', width: 25 },
      { header: 'Kecamatan', key: 'kecamatan', width: 20 },
      { header: 'Kelurahan', key: 'kelurahan', width: 20 },
      { header: 'Dapil', key: 'dapil', width: 15 },
      { header: 'Status', key: 'status', width: 12 },
      { header: 'Email', key: 'email', width: 25 },
    ];

    // Style header
    sheet.getRow(1).font = { bold: true };
    sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1B3A5C' } };
    sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

    rows.forEach((row, idx) => {
      sheet.addRow({
        no: idx + 1,
        tanggal: new Date(row.created_at).toLocaleDateString('id-ID'),
        nama: row.nama,
        kategori: row.kategori,
        isi: row.isi,
        kabupaten: row.kabupaten_nama || '-',
        kecamatan: row.kecamatan_nama || '-',
        kelurahan: row.kelurahan_nama || '-',
        dapil: row.dapil_nama || '-',
        status: row.status,
        email: row.email || '-',
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=aspirasi_${Date.now()}.xlsx`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Export aspirasi error:', error);
    res.status(500).json({ message: 'Gagal mengekspor data.' });
  }
};
