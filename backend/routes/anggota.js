const express = require('express');
const router = express.Router();
const anggotaController = require('../controllers/anggotaController');
const authMiddleware = require('../middleware/auth');
const { uploadImage } = require('../middleware/upload');

// Public routes
router.get('/', anggotaController.getAll);
router.get('/:id', anggotaController.getById);

// Admin routes
router.post('/', authMiddleware, uploadImage.single('foto'), anggotaController.create);
router.put('/:id', authMiddleware, uploadImage.single('foto'), anggotaController.update);
router.delete('/:id', authMiddleware, anggotaController.delete);

module.exports = router;
