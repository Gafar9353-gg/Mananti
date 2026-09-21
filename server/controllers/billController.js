import { db } from './authController.js';

export const uploadBill = async (req, res) => {
  try {
    const { patientId, billType } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const newBill = {
      _id: 'bill_' + Date.now(),
      patientId,
      billType,
      filePath: `/uploads/bills/${req.file.filename}`,
      originalName: req.file.originalname,
      createdAt: new Date().toISOString()
    };

    const patient = db.patients.find(p => p._id === patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    patient.bills.push(newBill);

    const io = req.app.get('socketio');
    if (io) io.emit('patient_updated', patient);

    res.status(201).json(newBill);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const generateBill = async (req, res) => {
  const { patientId, items, subtotal, gstAmount, totalAmount } = req.body;
  const index = db.patients.findIndex(p => p._id === patientId);
  if (index === -1) return res.status(404).json({ message: 'Patient not found' });

  const patient = db.patients[index];
  
  let maxBillNo = 0;
  db.patients.forEach(p => {
    if (p.financialBills) {
      p.financialBills.forEach(b => {
        if (b.billNo && b.billNo.startsWith('B-')) {
          const num = parseInt(b.billNo.replace('B-', ''), 10);
          if (!isNaN(num) && num > maxBillNo) maxBillNo = num;
        }
      });
    }
  });
  const nextBillNo = `B-${String(maxBillNo + 1).padStart(3, '0')}`;

  const newBill = {
    _id: 'finbill_' + Date.now(),
    billNo: nextBillNo,
    date: new Date().toISOString(),
    items, // Array of { name, dosing, days, batchNo, expDate, amount }
    subtotal,
    gstAmount,
    totalAmount,
    generatedBy: req.user.name
  };

  // Deduct stock for each item
  if (db.medicines) {
    items.forEach(item => {
      const medName = item.name || item.medicine;
      if (!medName) return;
      const medIndex = db.medicines.findIndex(m => m.name.toLowerCase() === medName.toLowerCase());
      if (medIndex !== -1) {
        // Assume quantity = 1 if not provided, or better: try to parse dosing/days if needed, but for simplicity let's decrement by 1 pack/course, or whatever unit they use. We will decrement by 1 for now, or if they have a 'quantity' field in the future.
        const qty = item.quantity ? parseInt(item.quantity) : 1; 
        db.medicines[medIndex].stock = Math.max(0, db.medicines[medIndex].stock - qty);
      }
    });
  }

  patient.financialBills = patient.financialBills || [];
  patient.financialBills.push(newBill);

  const io = req.app.get('socketio');
  if (io) io.emit('patient_updated', patient);

  res.status(201).json(patient);
};
