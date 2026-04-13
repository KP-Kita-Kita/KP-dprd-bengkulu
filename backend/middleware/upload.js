const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const dirs = ['uploads/berita', 'uploads/anggota', 'uploads/dokumen', 'uploads/aspirasi'];
dirs.forEach(dir => {
  const fullPath = path.join(__dirname, '..', dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

// Image upload config (for berita & anggota photos)
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const type = req.baseUrl.includes('anggota') ? 'anggota' : 'berita';
    cb(null, path.join(__dirname, '..', 'uploads', type));
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueName + path.extname(file.originalname));
  }
});

const imageFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Hanya file gambar (JPEG, PNG, GIF, WebP) yang diizinkan.'));
  }
};

const uploadImage = multer({
  storage: imageStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: imageFilter
});

// Document upload config (PDF only)
const docStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads', 'dokumen'));
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueName + path.extname(file.originalname));
  }
});

const docFilter = (req, file, cb) => {
  const allowedMimes = [
    'application/pdf',
    'application/msword',                                                    // .doc
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    'application/vnd.ms-excel',                                              // .xls
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',      // .xlsx
    'application/vnd.ms-powerpoint',                                         // .ppt
    'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
    'text/plain',                                                            // .txt
    'text/csv',                                                              // .csv
  ];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Format file tidak didukung. Format yang diizinkan: PDF, Word, Excel, PowerPoint, TXT, CSV.'));
  }
};

const uploadDoc = multer({
  storage: docStorage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
  fileFilter: docFilter
});

// Aspirasi upload config (gambar + PDF)
const aspirasiStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads', 'aspirasi'));
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueName + path.extname(file.originalname));
  }
});

const aspirasiFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
  const mimetype = allowedMimes.includes(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Hanya file gambar (JPEG, PNG, WebP) atau PDF yang diizinkan.'));
  }
};

const uploadAspirasi = multer({
  storage: aspirasiStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: aspirasiFilter
});

module.exports = { uploadImage, uploadDoc, uploadAspirasi };
