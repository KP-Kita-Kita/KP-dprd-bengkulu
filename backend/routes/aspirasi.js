const express = require('express');
const router = express.Router();
const aspirasiController = require('../controllers/aspirasiController');
const authMiddleware = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');
const { uploadAspirasi } = require('../middleware/upload');
const { createRateLimit } = require('../middleware/rateLimit');
const { wordFilterMiddleware } = require('../middleware/wordFilter');

// Public route — submit aspirasi
router.post('/',
  createRateLimit(2, 5 * 60 * 1000), // max 2 per 5 menit
  uploadAspirasi.single('lampiran'),
  wordFilterMiddleware(['isi', 'nama']),
  aspirasiController.create
);

// Admin routes
router.get('/stats', authMiddleware, roleAuth('admin'), aspirasiController.getStats);
router.get('/export', authMiddleware, roleAuth('admin'), aspirasiController.exportExcel);
router.get('/', authMiddleware, aspirasiController.getAll);
router.put('/:id/status', authMiddleware, roleAuth('admin'), aspirasiController.updateStatus);

// Dewan routes
router.get('/dewan', authMiddleware, roleAuth('dewan'), aspirasiController.getDewan);
router.get('/dewan/stats', authMiddleware, roleAuth('dewan'), aspirasiController.getDewanStats);
router.put('/:id/dewan-status', authMiddleware, roleAuth('dewan'), aspirasiController.updateDewanStatus);

module.exports = router;
