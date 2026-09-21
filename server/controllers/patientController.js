import { db } from './authController.js';

export const createPatient = async (req, res) => {
  const { name, careOf, age, gender, contact, location, doctorName, dateOfVisit, remarks } = req.body;
  
  const count = db.patients.length + 1; // Sequential ID generation
  const pid = `P${String(count).padStart(3, '0')}`; // e.g., P001

  const newPatient = {
    _id: 'pat_' + Date.now(),
    pid,
    name, careOf, age, gender, contact, location, doctorName, dateOfVisit, remarks,
    history: [],
    bills: [],
    prescriptions: [],
    createdBy: req.user._id, // Set by middleware
    createdAt: new Date().toISOString()
  };

  db.patients.unshift(newPatient);

  const io = req.app.get('socketio');
  if (io) io.emit('patient_added', newPatient);

  res.status(201).json(newPatient);
};

export const getPatients = async (req, res) => {
  res.json(db.patients);
};

export const getPatientById = async (req, res) => {
  const patient = db.patients.find(p => p._id === req.params.id);
  if (patient) {
    res.json(patient);
  } else {
    res.status(404).json({ message: 'Patient not found' });
  }
};

export const updatePatient = async (req, res) => {
  const index = db.patients.findIndex(p => p._id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Patient not found' });

  const patient = db.patients[index];

  // Save history snapshot
  const historySnapshot = {
    name: patient.name,
    age: patient.age,
    disease: patient.disease,
    notes: patient.notes,
    remarks: patient.remarks,
    updatedAt: new Date().toISOString(),
    updatedBy: req.user._id
  };

  const updatedPatient = {
    ...patient,
    ...req.body,
    history: [...(patient.history || []), historySnapshot]
  };

  db.patients[index] = updatedPatient;

  const io = req.app.get('socketio');
  if (io) io.emit('patient_updated', updatedPatient);

  res.json(updatedPatient);
};

export const addPrescription = async (req, res) => {
  const { disease, medicines, nextVisit } = req.body;
  const index = db.patients.findIndex(p => p._id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Patient not found' });

  const patient = db.patients[index];

  const newPrescription = {
    _id: 'rx_' + Date.now(),
    date: new Date().toISOString(),
    doctorId: req.user._id,
    doctorName: req.user.name,
    disease,
    medicines, // Array of { name, dosing, days }
    nextVisit
  };

  patient.prescriptions = patient.prescriptions || [];
  patient.prescriptions.push(newPrescription);
  
  patient.disease = disease; // Update current disease on the patient profile

  const io = req.app.get('socketio');
  if (io) io.emit('patient_updated', patient);

  res.status(201).json(patient);
};
