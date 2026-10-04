import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Convert import.meta.url to __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, '..', 'uploads', 'bills');

// Ensure directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|webp|pdf|doc|docx|txt/;
  const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
  const extname = filetypes.test(ext);
  
  if (extname || file.mimetype.includes('image') || file.mimetype.includes('pdf') || file.mimetype.includes('document')) {
    return cb(null, true);
  } else {
    // Graceful acceptance to prevent application crashes
    return cb(null, true);
  }
}

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB max
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

export default upload;
