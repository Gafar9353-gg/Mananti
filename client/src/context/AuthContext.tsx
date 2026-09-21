import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userInfo = localStorage.getItem('doctorInfo');
    if (userInfo) {
      setDoctor(JSON.parse(userInfo));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await axios.post('http://localhost:5005/api/auth/login', { email, password });
    setDoctor(data);
    localStorage.setItem('doctorInfo', JSON.stringify(data));
  };

  const register = async (name, email, password) => {
    const { data } = await axios.post('http://localhost:5005/api/auth/register', { name, email, password });
    setDoctor(data);
    localStorage.setItem('doctorInfo', JSON.stringify(data));
  };

  const logout = () => {
    setDoctor(null);
    localStorage.removeItem('doctorInfo');
  };

  return (
    <AuthContext.Provider value={{ doctor, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
