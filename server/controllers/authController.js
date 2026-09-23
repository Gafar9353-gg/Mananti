import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/index.js';

// Seed default users if none exist
const seedDefaultUsers = async () => {
  try {
    const count = await User.countDocuments();
    if (count === 0) {
      await User.create([
        {
          _id: 'doc_123',
          name: 'Dr. Mahima Acharya MBBS, MD Psychiatrist',
          email: 'doctor',
          password: bcrypt.hashSync('doctor123', 10),
          role: 'doctor'
        },
        {
          _id: 'staff_1',
          name: 'Staff - Mananti Portal',
          email: 'staff',
          password: bcrypt.hashSync('staff123', 10),
          role: 'staff'
        }
      ]);
      console.log('Default users created in MongoDB');
    }
  } catch (err) {
    console.error('Error seeding users:', err);
  }
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '30d' });
};

export const registerDoctor = async (req, res) => {
  try {
    const { name, email, password, role = 'doctor' } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      _id: 'user_' + Date.now(),
      name,
      email,
      password: bcrypt.hashSync(password, 10),
      role
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

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
  } catch (error) {
    res.status(500).json({ message: error.message });
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