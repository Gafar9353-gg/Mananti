import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Support offline / demo / mobile preview tokens
      if (token && (token.startsWith('demo-') || token === 'demo-doctor-token' || token === 'demo-staff-token')) {
        const isDoctor = token.includes('doctor') || token === 'demo-doctor-token';
        req.user = {
          _id: isDoctor ? 'doc_123' : 'staff_1',
          name: isDoctor ? 'Dr. Mahima Acharya' : 'Staff Portal',
          role: isDoctor ? 'doctor' : 'staff'
        };
        return next();
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');

      req.user = await User.findById(decoded.id);
      
      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }
      
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};
