const express = require('express');
const router = express.Router();
const profilController = require('../controllers/profilController');
const authMiddleware = require('../middleware/auth');

// Public route
router.get('/', profilController.getAll);

// Admin routes
router.put('/:key', authMiddleware, profilController.update);
router.get('/dashboard/stats', authMiddleware, profilController.getDashboardStats);

module.exports = router;
