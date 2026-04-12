const express = require('express');
const router = express.Router();
const beritaController = require('../controllers/beritaController');
const authMiddleware = require('../middleware/auth');
const { uploadImage } = require('../middleware/upload');
const optionalAuthMiddleware = require('../middleware/optionalAuth');

// Public routes
router.get('/', optionalAuthMiddleware, beritaController.getAll);
router.get('/:id', beritaController.getById);

// Admin routes
router.post('/', authMiddleware, uploadImage.single('gambar'), beritaController.create);
router.put('/:id', authMiddleware, uploadImage.single('gambar'), beritaController.update);
router.delete('/:id', authMiddleware, beritaController.delete);

module.exports = router;
