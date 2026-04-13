const express = require('express');
const router = express.Router();
const dapilController = require('../controllers/dapilController');
const authMiddleware = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');

// Semua route dilindungi auth + role admin
router.get('/', authMiddleware, dapilController.getAll);
router.post('/', authMiddleware, roleAuth('admin'), dapilController.create);
router.put('/:id', authMiddleware, roleAuth('admin'), dapilController.update);
router.delete('/:id', authMiddleware, roleAuth('admin'), dapilController.delete);

module.exports = router;
