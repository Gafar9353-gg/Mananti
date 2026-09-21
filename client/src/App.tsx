import React, { useContext } from 'react';
import { Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import PatientDetail from './pages/PatientDetail';
import Patients from './pages/Patients';
import Appointments from './pages/Appointments';
import SalesReports from './pages/SalesReports';
import StockManagement from './pages/StockManagement';
import { LayoutDashboard, Users, Calendar, FileText, Pill, FolderOpen, BarChart2, Settings, Bell, ChevronDown, LogOut, TrendingUp, PackageSearch } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  const { doctor, loading } = useContext(AuthContext);
  if (loading) return null;
  return doctor ? children : <Navigate to="/login" />;
};

const Sidebar = () => {
  const location = useLocation();
  const { doctor, logout } = useContext(AuthContext);

  const menu = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Patients', path: '/patients' },
    { icon: Calendar, label: 'Appointments', path: '/appointments' },
  ];

  if (doctor?.role === 'doctor') {
    menu.push({ icon: TrendingUp, label: 'Sales & Stocks', path: '/sales' });
    menu.push({ icon: PackageSearch, label: 'Manage Inventory', path: '/inventory' });
  }

  return (
    <div className="w-64 bg-slate-50 h-screen border-r border-slate-200 flex flex-col fixed left-0 top-0 z-50">
      <div className="p-6 flex items-center gap-3 border-b border-slate-200 bg-white">
        <div className="bg-blue-600 p-2 rounded-xl text-white shadow-sm">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
        </div>
        <div>
          <h2 className="font-bold text-slate-800 leading-tight tracking-wide text-lg">MANANTI</h2>
          <p className="text-[10px] text-slate-500">Healthcare Portal</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        {menu.map(item => {
          const active = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <Link key={item.label} to={item.path} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${active ? 'bg-blue-100/50 text-blue-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}>
              <item.icon className="h-5 w-5" /> {item.label}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-slate-200 bg-slate-50">
        <button onClick={logout} className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors">
          <LogOut className="h-5 w-5" /> Logout
        </button>
      </div>
    </div>
  );
};

const Topbar = () => {
  const { doctor } = useContext(AuthContext);
  const isDoctor = doctor?.role === 'doctor';
  
  return (
    <div className="h-20 bg-white border-b border-slate-200 flex items-center justify-end px-8 sticky top-0 z-40 shadow-sm">
      <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 cursor-pointer">
          <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold border border-blue-100">
            {isDoctor ? 'DR' : 'ST'}
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">{isDoctor ? 'Doctor' : 'Staff'}</p>
            <p className="text-xs text-slate-500">MANANTI Portal</p>
          </div>
          <ChevronDown className="h-4 w-4 text-slate-400" />
        </div>
      </div>
    </div>
  );
};

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col h-screen overflow-hidden">
        <Topbar />
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      
      {/* Protected Routes inside Layout */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/patients"
        element={
          <ProtectedRoute>
            <Layout>
              <Patients />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/appointments"
        element={
          <ProtectedRoute>
            <Layout>
              <Appointments />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <PatientDetail />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/sales"
        element={
          <ProtectedRoute>
            <Layout>
              <SalesReports />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/inventory"
        element={
          <ProtectedRoute>
            <Layout>
              <StockManagement />
            </Layout>
          </ProtectedRoute>
        }
      />
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
