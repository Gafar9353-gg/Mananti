import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Disable buffering so it fails immediately instead of hanging for 10000ms
    mongoose.set('bufferCommands', false);
    
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/patient_management', {
      serverSelectionTimeoutMS: 5000 // Fail faster if IP is blocked
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error FATAL: ${error.message}`);
    console.error(`Did you whitelist 0.0.0.0/0 in MongoDB Atlas?`);
    console.error(`Are you sure your password in MONGO_URI is exactly correct?`);
  }
};

export default connectDB;
