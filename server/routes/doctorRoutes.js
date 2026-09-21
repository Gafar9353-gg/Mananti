import express from 'express';
import { registerDoctor, loginDoctor, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerDoctor);
router.post('/login', loginDoctor);
router.get('/me', protect, getMe);

export default router;
