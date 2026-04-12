const express = require('express');
const router = express.Router();
const dokumenController = require('../controllers/dokumenController');
const authMiddleware = require('../middleware/auth');
const { uploadDoc } = require('../middleware/upload');

// Public routes
router.get('/', dokumenController.getAll);
router.get('/kategori', dokumenController.getKategori);

// Admin routes
router.post('/', authMiddleware, uploadDoc.single('file'), dokumenController.create);
router.put('/:id', authMiddleware, uploadDoc.single('file'), dokumenController.update);
router.delete('/:id', authMiddleware, dokumenController.delete);
router.post('/kategori', authMiddleware, dokumenController.createKategori);

module.exports = router;
