import { Patient, Medicine } from '../models/index.js';

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

    const patient = await Patient.findByIdAndUpdate(
      patientId,
      { $push: { bills: newBill } },
      { new: true }
    );

    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    const io = req.app.get('socketio');
    if (io) io.emit('patient_updated', patient);

    res.status(201).json(newBill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const generateBill = async (req, res) => {
  try {
    const { patientId, items, subtotal, gstAmount, totalAmount } = req.body;
    
    let maxBillNo = 0;
    const allPatients = await Patient.find({});
    allPatients.forEach(p => {
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
      items,
      subtotal,
      gstAmount,
      totalAmount,
      generatedBy: req.user.name
    };

    // Deduct stock for each item
    for (const item of items) {
      const medName = item.name || item.medicine;
      if (!medName) continue;
      
      const qty = item.quantity ? parseInt(item.quantity) : 1;
      
      // Case-insensitive update using mongoose
      const med = await Medicine.findOne({ name: { $regex: new RegExp('^' + medName + '$', 'i') } });
      if (med) {
        med.stock = Math.max(0, (med.stock || 0) - qty);
        await med.save();
      }
    }

    const patient = await Patient.findByIdAndUpdate(
      patientId,
      { $push: { financialBills: newBill } },
      { new: true }
    );

    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    const io = req.app.get('socketio');
    if (io) io.emit('patient_updated', patient);

    res.status(201).json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
