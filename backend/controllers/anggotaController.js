const { pool } = require('../config/db');
const fs = require('fs');
const path = require('path');

exports.getAll = async (req, res) => {
  try {
    const dapil = req.query.dapil;
    const fraksi = req.query.fraksi;

    let query = 'SELECT * FROM anggota';
    const params = [];
    const conditions = [];

    if (dapil) {
      conditions.push('dapil = ?');
      params.push(dapil);
    }
    if (fraksi) {
      conditions.push('fraksi = ?');
      params.push(fraksi);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY jabatan ASC, nama ASC';

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Get anggota error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
};

exports.getById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM anggota WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Anggota tidak ditemukan.' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Get anggota by id error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
};

exports.create = async (req, res) => {
  try {
    const { nama, jabatan, dapil, daerah_pemilihan, fraksi, bio, periode } = req.body;

    if (!nama) {
      return res.status(400).json({ message: 'Nama anggota wajib diisi.' });
    }

    const foto = req.file ? `/uploads/anggota/${req.file.filename}` : null;

    const [result] = await pool.query(
      'INSERT INTO anggota (nama, jabatan, dapil, daerah_pemilihan, fraksi, foto, bio, periode) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [nama, jabatan, dapil, daerah_pemilihan, fraksi, foto, bio, periode || '2024-2029']
    );

    res.status(201).json({
      message: 'Anggota berhasil ditambahkan.',
      id: result.insertId
    });
  } catch (error) {
    console.error('Create anggota error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
};

exports.update = async (req, res) => {
  try {
    const { nama, jabatan, dapil, daerah_pemilihan, fraksi, bio, periode } = req.body;
    const id = req.params.id;

    const [existing] = await pool.query('SELECT * FROM anggota WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Anggota tidak ditemukan.' });
    }

    let foto = existing[0].foto;
    if (req.file) {
      if (foto) {
        const oldPath = path.join(__dirname, '..', foto);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      foto = `/uploads/anggota/${req.file.filename}`;
    }

    await pool.query(
      'UPDATE anggota SET nama = ?, jabatan = ?, dapil = ?, daerah_pemilihan = ?, fraksi = ?, foto = ?, bio = ?, periode = ? WHERE id = ?',
      [
        nama || existing[0].nama,
        jabatan || existing[0].jabatan,
        dapil || existing[0].dapil,
        daerah_pemilihan || existing[0].daerah_pemilihan,
        fraksi || existing[0].fraksi,
        foto,
        bio || existing[0].bio,
        periode || existing[0].periode,
        id
      ]
    );

    res.json({ message: 'Anggota berhasil diperbarui.' });
  } catch (error) {
    console.error('Update anggota error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
};

exports.delete = async (req, res) => {
  try {
    const [existing] = await pool.query('SELECT * FROM anggota WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Anggota tidak ditemukan.' });
    }

    if (existing[0].foto) {
      const filePath = path.join(__dirname, '..', existing[0].foto);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await pool.query('DELETE FROM anggota WHERE id = ?', [req.params.id]);
    res.json({ message: 'Anggota berhasil dihapus.' });
  } catch (error) {
    console.error('Delete anggota error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
};
