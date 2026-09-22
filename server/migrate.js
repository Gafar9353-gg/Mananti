import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'database.json');

const strictFalse = { strict: false, versionKey: false };

const Patient = mongoose.model('Patient', new mongoose.Schema({}, strictFalse));
const Bill = mongoose.model('Bill', new mongoose.Schema({}, strictFalse));
const Medicine = mongoose.model('Medicine', new mongoose.Schema({}, strictFalse));
const Purchase = mongoose.model('Purchase', new mongoose.Schema({}, strictFalse));
const Appointment = mongoose.model('Appointment', new mongoose.Schema({}, strictFalse));
const User = mongoose.model('User', new mongoose.Schema({}, strictFalse));

const migrate = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/patient_management';
    console.log('Connecting to MongoDB...', MONGO_URI);
    await mongoose.connect(MONGO_URI);
    console.log('Connected!');

    if (!fs.existsSync(DATA_FILE)) {
      console.log('No database.json found. Nothing to migrate.');
      process.exit(0);
    }

    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    
    console.log('Migrating users...');
    if (data.users && data.users.length > 0) {
      await User.deleteMany({});
      await User.insertMany(data.users);
      console.log(`Inserted ${data.users.length} users.`);
    }

    console.log('Migrating patients...');
    if (data.patients && data.patients.length > 0) {
      await Patient.deleteMany({});
      await Patient.insertMany(data.patients);
      console.log(`Inserted ${data.patients.length} patients.`);
    }

    console.log('Migrating medicines...');
    if (data.medicines && data.medicines.length > 0) {
      await Medicine.deleteMany({});
      await Medicine.insertMany(data.medicines);
      console.log(`Inserted ${data.medicines.length} medicines.`);
    }

    console.log('Migrating purchases...');
    if (data.purchases && data.purchases.length > 0) {
      await Purchase.deleteMany({});
      await Purchase.insertMany(data.purchases);
      console.log(`Inserted ${data.purchases.length} purchases.`);
    }

    console.log('Migrating appointments...');
    if (data.appointments && data.appointments.length > 0) {
      await Appointment.deleteMany({});
      await Appointment.insertMany(data.appointments);
      console.log(`Inserted ${data.appointments.length} appointments.`);
    }

    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrate();
