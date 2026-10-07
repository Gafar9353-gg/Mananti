import mongoose from 'mongoose';

const strictFalse = { strict: false, versionKey: false };

export const Patient = mongoose.models.Patient || mongoose.model('Patient', new mongoose.Schema({ _id: String }, strictFalse));
export const Bill = mongoose.models.Bill || mongoose.model('Bill', new mongoose.Schema({ _id: String }, strictFalse));
const medicineSchema = new mongoose.Schema({
  _id: String,
  name: { type: String, required: true },
  pack: String,
  batch: String,
  exp: String,
  stock: { type: Number, default: 0 },
  vendor: String,
  mrp: String,
  rate: String,
  mfr: String,
  hsn: String,
  sgstPercent: { type: Number, default: 0 },
  cgstPercent: { type: Number, default: 0 },
  lastRestocked: String
}, strictFalse);

export const Medicine = mongoose.models.Medicine || mongoose.model('Medicine', medicineSchema);
export const Purchase = mongoose.models.Purchase || mongoose.model('Purchase', new mongoose.Schema({ _id: String }, strictFalse));
export const Appointment = mongoose.models.Appointment || mongoose.model('Appointment', new mongoose.Schema({ _id: String }, strictFalse));
export const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({ _id: String }, strictFalse));
