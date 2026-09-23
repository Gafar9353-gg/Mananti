import mongoose from 'mongoose';

mongoose.set('bufferCommands', false);

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      serverSelectionTimeoutMS: 5000
    };
    cached.promise = mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/patient_management', opts).then((mongoose) => {
      console.log(`MongoDB Connected: ${mongoose.connection.host}`);
      return mongoose;
    }).catch(err => {
      console.error(`MongoDB Connection Error FATAL: ${err.message}`);
      throw err;
    });
  }
  
  cached.conn = await cached.promise;
  return cached.conn;
};

export default connectDB;
