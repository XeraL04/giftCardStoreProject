const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Define storage folder and filename configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '..', 'uploads', 'payments');
        // Make sure directory exists, create if not
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        // Filename: proof-<timestamp>-<random>.<ext>
        const ext = path.extname(file.originalname);
        const basename = 'proof-' + Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, basename + ext);
    }
});

// File filter to allow only images and pdf files
function fileFilter(req, file, cb) {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPG, PNG, and PDF files are allowed.'));
    }
}

// Limits (max file size ~8 MB)
const limits = {
    fileSize: 8 * 1024 * 1024 // 8 MB
};

// Multer upload middleware instance
const upload = multer({
    storage,
    fileFilter,
    limits
});

module.exports = upload;
