import express from 'express';
import {
  getPatients,
  getPatientById,
  createPatient,
  updatePatient,
  addPrescription,
} from '../controllers/patientController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getPatients).post(protect, createPatient);
router.route('/:id').get(protect, getPatientById).put(protect, updatePatient);
router.route('/:id/prescriptions').post(protect, addPrescription);

export default router;
