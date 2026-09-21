import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getMedicines, getPurchases, purchaseEntry, adjustStock, addMedicine, updateMedicine, markPurchasePaid } from '../controllers/medicineController.js';

const router = express.Router();

router.get('/', protect, getMedicines);
router.post('/', protect, addMedicine);
router.put('/:id', protect, updateMedicine);
router.get('/purchases', protect, getPurchases);
router.post('/purchase', protect, purchaseEntry);
router.put('/purchase/:id/pay', protect, markPurchasePaid);
router.post('/adjust', protect, adjustStock);

export default router;
