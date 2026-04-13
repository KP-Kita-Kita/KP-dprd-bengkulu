const express = require('express');
const router = express.Router();
const agendaController = require('../controllers/agendaController');
const authMiddleware = require('../middleware/auth');

// ===== PUBLIC ROUTES (tanpa auth) =====
router.get('/public',          agendaController.getPublic);   // semua agenda bulan/range tertentu
router.get('/public/terdekat', agendaController.getTerdekat); // 3 agenda terdekat untuk widget beranda

// ===== ADMIN ROUTES (dilindungi auth) =====
router.get('/',     authMiddleware, agendaController.getAll);
router.post('/',    authMiddleware, agendaController.create);
router.put('/:id',  authMiddleware, agendaController.update);
router.delete('/:id', authMiddleware, agendaController.delete);

module.exports = router;
