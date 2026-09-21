import { db } from './authController.js';

export const bookAppointment = async (req, res) => {
  const { name, phone, date, timeSlot } = req.body;
  
  // First come first serve token based on the selected date
  const appointmentsOnDate = db.appointments.filter(a => a.date === date);
  const tokenNumber = appointmentsOnDate.length + 1;

  const newAppointment = {
    _id: 'app_' + Date.now(),
    name,
    phone,
    date,
    timeSlot,
    tokenNumber,
    status: 'Scheduled',
    createdAt: new Date().toISOString()
  };

  db.appointments.push(newAppointment);
  res.status(201).json(newAppointment);
};

export const getAppointments = async (req, res) => {
  res.json(db.appointments);
};
