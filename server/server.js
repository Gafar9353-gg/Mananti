import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { Server } from 'socket.io';

import connectDB from './config/db.js';
import doctorRoutes from './routes/doctorRoutes.js';
import patientRoutes from './routes/patientRoutes.js';
import billRoutes from './routes/billRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import medicineRoutes from './routes/medicineRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

app.get('/api/health', (req, res) => {
  const state = mongoose.connection.readyState;
  const states = { 0: 'Disconnected', 1: 'Connected', 2: 'Connecting', 3: 'Disconnecting' };
  res.json({
    status: 'API is running',
    mongoDB_Status: states[state] || 'Unknown',
    mongoDB_URI_Set: !!process.env.MONGO_URI
  });
});

// Force DB connection before handling API routes
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(500).json({ message: "Database connection failed", error: error.message });
  }
});

// Routes that need DB
app.get('/api/debug', async (req, res) => {
  try {
    const { User } = await import('./models/index.js');
    const userCount = await User.countDocuments();
    const users = await User.find({}, 'email role name');

    res.json({
      databaseUsersCount: userCount,
      usersFound: users
    });
  } catch (err) {
    res.json({ error: err.message });
  }
});

app.get('/api/seed', async (req, res) => {
  try {
    const bcrypt = await import('bcryptjs');
    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');
    
    if (await usersCollection.countDocuments() > 0) return res.json("Already exists");

    await usersCollection.insertMany([
      { _id: 'doc_123', name: 'Dr. Mahima Acharya', email: 'doctor', password: bcrypt.default.hashSync('doctor123', 10), role: 'doctor' },
      { _id: 'staff_1', name: 'Staff Portal', email: 'staff', password: bcrypt.default.hashSync('staff123', 10), role: 'staff' }
    ]);
    res.json("SUCCESS! Accounts Created!");
  } catch (err) {
    res.json("Error: " + err.message);
  }
});

// Socket.io Setup
const io = new Server(server, {
  cors: {
    origin: '*', // For dev, allow all
    methods: ['GET', 'POST', 'PUT']
  }
});

// Make io accessible to our router
app.set('socketio', io);

// Middleware
app.use(cors());
app.use(express.json());

// Make uploads folder static
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', doctorRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/bills', billRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/medicines', medicineRoutes);

app.get('/', (req, res) => {
  res.send('Patient Management API is running...');
});

// Socket Connection
io.on('connection', (socket) => {
  console.log('A doctor connected via socket:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5005;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
