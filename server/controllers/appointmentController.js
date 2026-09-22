import { Appointment } from '../models/index.js';

export const bookAppointment = async (req, res) => {
  try {
    const { name, phone, date, timeSlot } = req.body;
    
    // First come first serve token based on the selected date
    const appointmentsOnDate = await Appointment.countDocuments({ date });
    const tokenNumber = appointmentsOnDate + 1;

    const newAppointment = await Appointment.create({
      _id: 'app_' + Date.now(),
      name,
      phone,
      date,
      timeSlot,
      tokenNumber,
      status: 'Scheduled',
      createdAt: new Date().toISOString()
    });

    res.status(201).json(newAppointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ createdAt: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
