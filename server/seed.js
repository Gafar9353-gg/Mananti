import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import Doctor from './models/Doctor.js';
import connectDB from './config/db.js';

dotenv.config();

const seedDoctor = async () => {
  await connectDB();
  
  try {
    // Check if exists
    const exists = await Doctor.findOne({ email: 'doctor' });
    if (exists) {
      console.log('Doctor account already exists!');
      process.exit();
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('doctor123', salt);

    // Create doctor
    const doc = await Doctor.create({
      name: 'Dr. Rajesh Kumar',
      email: 'doctor',
      password: hashedPassword
    });

    console.log('Successfully created default doctor account:');
    console.log('Username/Email: doctor');
    console.log('Password: doctor123');
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDoctor();
