import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { doctor, logout } = useContext(AuthContext);

  return (
    <nav className="bg-white shadow-sm border-b px-4 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-primary">
          <Activity className="h-6 w-6" />
          <span className="font-bold text-xl tracking-tight">NRAPP Health</span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-600 font-medium">Dr. {doctor?.name}</span>
          <button
            onClick={logout}
            className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-red-600 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
