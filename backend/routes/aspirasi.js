const express = require('express');
const router = express.Router();
const aspirasiController = require('../controllers/aspirasiController');
const authMiddleware = require('../middleware/auth');

// Public route
router.post('/', aspirasiController.create);

// Admin routes
router.get('/', authMiddleware, aspirasiController.getAll);
router.put('/:id/status', authMiddleware, aspirasiController.updateStatus);

module.exports = router;
