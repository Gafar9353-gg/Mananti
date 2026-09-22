import mongoose from 'mongoose';

const strictFalse = { strict: false, versionKey: false };

export const Patient = mongoose.models.Patient || mongoose.model('Patient', new mongoose.Schema({}, strictFalse));
export const Bill = mongoose.models.Bill || mongoose.model('Bill', new mongoose.Schema({}, strictFalse));
export const Medicine = mongoose.models.Medicine || mongoose.model('Medicine', new mongoose.Schema({}, strictFalse));
export const Purchase = mongoose.models.Purchase || mongoose.model('Purchase', new mongoose.Schema({}, strictFalse));
export const Appointment = mongoose.models.Appointment || mongoose.model('Appointment', new mongoose.Schema({}, strictFalse));
export const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({}, strictFalse));
