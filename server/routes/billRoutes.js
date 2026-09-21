import express from 'express';
import { uploadBill, generateBill } from '../controllers/billController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/upload', protect, upload.single('file'), uploadBill);
router.post('/generate', protect, generateBill);

export default router;
