import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'database.json');

let initialData = {
  users: [
    {
      _id: 'doc_123',
      name: 'Dr. Rajesh Kumar',
      email: 'doctor',
      password: bcrypt.hashSync('doctor123', 10),
      role: 'doctor'
    },
    {
      _id: 'staff_1',
      name: 'Reception Desk',
      email: 'staff',
      password: bcrypt.hashSync('staff123', 10),
      role: 'staff'
    }
  ],
  patients: [],
  appointments: [],
  medicines: []
};

if (fs.existsSync(DATA_FILE)) {
  try {
    initialData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  } catch (e) {
    console.error("Failed to load db file, using default.");
  }
}

export const db = initialData;

setInterval(() => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
}, 2000);

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '30d' });
};

export const registerDoctor = async (req, res) => {
  const { name, email, password, role = 'doctor' } = req.body;

  const userExists = db.users.find(d => d.email === email);
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const user = {
    _id: 'user_' + Date.now(),
    name,
    email,
    password: bcrypt.hashSync(password, 10),
    role
  };

  db.users.push(user);

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  });
};

export const loginDoctor = async (req, res) => {
  const { email, password } = req.body;

  const user = db.users.find(d => d.email === email);

  if (user && bcrypt.compareSync(password, user.password)) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

export const getMe = async (req, res) => {
  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role
  });
};