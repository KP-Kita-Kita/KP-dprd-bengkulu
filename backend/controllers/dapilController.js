const { pool } = require('../config/db');

// GET /api/dapil — Lihat semua dapil + wilayah + anggota
exports.getAll = async (req, res) => {
  try {
    const [dapils] = await pool.query('SELECT * FROM dapil ORDER BY nama ASC');

    // Ambil relasi wilayah dan anggota untuk setiap dapil
    const result = [];
    for (const dapil of dapils) {
      const [wilayah] = await pool.query(
        'SELECT * FROM dapil_wilayah WHERE dapil_id = ?', [dapil.id]
      );
      const [anggota] = await pool.query(
        `SELECT da.*, a.nama, a.jabatan, a.fraksi, a.foto
         FROM dapil_anggota da
         JOIN anggota a ON da.anggota_id = a.id
         WHERE da.dapil_id = ?`, [dapil.id]
      );
      result.push({
        ...dapil,
        wilayah,
        anggota: anggota.map(a => ({
          id: a.anggota_id,
          nama: a.nama,
          jabatan: a.jabatan,
          fraksi: a.fraksi,
          foto: a.foto
        }))
      });
    }

    res.json(result);
  } catch (error) {
    console.error('Get dapil error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
};

// POST /api/dapil — Buat dapil baru
exports.create = async (req, res) => {
  try {
    const { nama, deskripsi, wilayah, anggota_ids } = req.body;

    if (!nama) {
      return res.status(400).json({ message: 'Nama dapil wajib diisi.' });
    }

    const [result] = await pool.query(
      'INSERT INTO dapil (nama, deskripsi) VALUES (?, ?)',
      [nama, deskripsi || null]
    );
    const dapilId = result.insertId;

    // Insert wilayah mapping
    if (wilayah && Array.isArray(wilayah)) {
      for (const wil of wilayah) {
        await pool.query(
          'INSERT INTO dapil_wilayah (dapil_id, kabupaten_id, kabupaten_nama) VALUES (?, ?, ?)',
          [dapilId, wil.id, wil.nama]
        );
      }
    }

    // Insert anggota mapping
    if (anggota_ids && Array.isArray(anggota_ids)) {
      for (const anggotaId of anggota_ids) {
        await pool.query(
          'INSERT INTO dapil_anggota (dapil_id, anggota_id) VALUES (?, ?)',
          [dapilId, anggotaId]
        );
      }
    }

    res.status(201).json({ message: 'Dapil berhasil ditambahkan.', id: dapilId });
  } catch (error) {
    console.error('Create dapil error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Nama dapil atau wilayah sudah terdaftar.' });
    }
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
};

// PUT /api/dapil/:id — Edit dapil
exports.update = async (req, res) => {
  try {
    const { nama, deskripsi, wilayah, anggota_ids } = req.body;
    const id = req.params.id;

    const [existing] = await pool.query('SELECT * FROM dapil WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Dapil tidak ditemukan.' });
    }

    await pool.query(
      'UPDATE dapil SET nama = ?, deskripsi = ? WHERE id = ?',
      [nama || existing[0].nama, deskripsi !== undefined ? deskripsi : existing[0].deskripsi, id]
    );

    // Replace wilayah mapping
    if (wilayah && Array.isArray(wilayah)) {
      await pool.query('DELETE FROM dapil_wilayah WHERE dapil_id = ?', [id]);
      for (const wil of wilayah) {
        await pool.query(
          'INSERT INTO dapil_wilayah (dapil_id, kabupaten_id, kabupaten_nama) VALUES (?, ?, ?)',
          [id, wil.id, wil.nama]
        );
      }
    }

    // Replace anggota mapping
    if (anggota_ids && Array.isArray(anggota_ids)) {
      await pool.query('DELETE FROM dapil_anggota WHERE dapil_id = ?', [id]);
      for (const anggotaId of anggota_ids) {
        await pool.query(
          'INSERT INTO dapil_anggota (dapil_id, anggota_id) VALUES (?, ?)',
          [id, anggotaId]
        );
      }
    }

    res.json({ message: 'Dapil berhasil diperbarui.' });
  } catch (error) {
    console.error('Update dapil error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Nama dapil atau wilayah sudah terdaftar.' });
    }
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
};

// DELETE /api/dapil/:id — Hapus dapil
exports.delete = async (req, res) => {
  try {
    const [existing] = await pool.query('SELECT * FROM dapil WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Dapil tidak ditemukan.' });
    }

    await pool.query('DELETE FROM dapil WHERE id = ?', [req.params.id]);
    res.json({ message: 'Dapil berhasil dihapus.' });
  } catch (error) {
    console.error('Delete dapil error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
};
