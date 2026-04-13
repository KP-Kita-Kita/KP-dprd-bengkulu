const express = require('express');
const router = express.Router();
const wilayahController = require('../controllers/wilayahController');

// Public routes — tidak perlu auth
router.get('/kabupaten', wilayahController.getKabupaten);
router.get('/kecamatan/:kabId', wilayahController.getKecamatan);
router.get('/kelurahan/:kecId', wilayahController.getKelurahan);

module.exports = router;
