import { Patient } from '../models/index.js';

export const createPatient = async (req, res) => {
  try {
    const { name, careOf, age, gender, contact, location, doctorName, dateOfVisit, remarks } = req.body;
    
    const count = await Patient.countDocuments();
    const pid = `P${String(count + 1).padStart(3, '0')}`;

    const newPatient = await Patient.create({
      _id: 'pat_' + Date.now(),
      pid,
      name, careOf, age, gender, contact, location, doctorName, dateOfVisit, remarks,
      history: [],
      bills: [],
      prescriptions: [],
      createdBy: req.user._id,
      createdAt: new Date().toISOString()
    });

    const io = req.app.get('socketio');
    if (io) io.emit('patient_added', newPatient);

    res.status(201).json(newPatient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPatients = async (req, res) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 });
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (patient) {
      res.json(patient);
    } else {
      res.status(404).json({ message: 'Patient not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    const historySnapshot = {
      name: patient.name,
      age: patient.age,
      disease: patient.disease,
      notes: patient.notes,
      remarks: patient.remarks,
      updatedAt: new Date().toISOString(),
      updatedBy: req.user._id
    };

    const updatedPatient = await Patient.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        $push: { history: historySnapshot }
      },
      { new: true }
    );

    const io = req.app.get('socketio');
    if (io) io.emit('patient_updated', updatedPatient);

    res.json(updatedPatient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addPrescription = async (req, res) => {
  try {
    const { disease, medicines, nextVisit } = req.body;
    
    const newPrescription = {
      _id: 'rx_' + Date.now(),
      date: new Date().toISOString(),
      doctorId: req.user._id,
      doctorName: req.user.name,
      disease,
      medicines,
      nextVisit
    };

    const updatedPatient = await Patient.findByIdAndUpdate(
      req.params.id,
      {
        disease,
        $push: { prescriptions: newPrescription }
      },
      { new: true }
    );

    if (!updatedPatient) return res.status(404).json({ message: 'Patient not found' });

    const io = req.app.get('socketio');
    if (io) io.emit('patient_updated', updatedPatient);

    res.status(201).json(updatedPatient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
