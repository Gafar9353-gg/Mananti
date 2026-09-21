import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { SocketContext } from '../context/SocketContext';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Calendar as CalendarIcon, FileText, ClipboardList, TrendingUp, Brain, Eye, Edit2, FileUp, Users } from 'lucide-react';
import PatientForm from '../components/PatientForm';
import AppointmentForm from '../components/AppointmentForm';

const Dashboard = () => {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  
  // Modals state
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);

  const socket = useContext(SocketContext);
  const { doctor } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${doctor.token}` } };
      
      const [patientRes, apptRes] = await Promise.all([
        axios.get(`http://localhost:5005/api/patients`, config),
        axios.get(`http://localhost:5005/api/appointments`, config)
      ]);
      
      setPatients(patientRes.data);
      setAppointments(apptRes.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('patient_added', (newPatient) => setPatients(prev => [newPatient, ...prev]));
      socket.on('patient_updated', (updated) => setPatients(prev => prev.map(p => p._id === updated._id ? updated : p)));
    }
    return () => {
      if (socket) { socket.off('patient_added'); socket.off('patient_updated'); }
    };
  }, [socket]);

  // Handle Edit Patient
  const handleEditClick = (patient) => {
    setEditingPatient(patient);
  };

  const currentHour = new Date().getHours();
  let greeting = 'Good Evening';
  if (currentHour < 12) greeting = 'Good Morning';
  else if (currentHour < 18) greeting = 'Good Afternoon';
  
  const isDoctor = doctor?.role === 'doctor';
  let finalName = doctor?.name?.split(' ')[0] || (isDoctor ? 'Doctor' : 'User');
  if (isDoctor && !finalName.toLowerCase().startsWith('dr') && finalName.toLowerCase() !== 'doctor') {
    finalName = 'Dr. ' + finalName;
  }

  return (
    <div className="h-full flex gap-6">
      <div className="flex-1 flex flex-col min-w-0">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1B2559]">{greeting}, {finalName}</h1>
          <p className="text-slate-500 mt-1">Take care of minds. It changes lives.</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {doctor?.role === 'staff' && (
            <>
              <div onClick={() => setShowAddForm(true)} className="bg-slate-50 border border-slate-200 hover:border-blue-400 p-6 rounded-2xl cursor-pointer transition-all shadow-sm group">
                <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <UserPlus className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800">Add New Patient</h3>
                <p className="text-xs text-slate-500 mt-1">Register a new patient</p>
              </div>

              <div onClick={() => setShowAppointmentForm(true)} className="bg-slate-50 border border-slate-200 hover:border-emerald-400 p-6 rounded-2xl cursor-pointer transition-all shadow-sm group">
                <div className="bg-emerald-100 text-emerald-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <CalendarIcon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800">Book Appointment</h3>
                <p className="text-xs text-slate-500 mt-1">Schedule next visit</p>
              </div>
            </>
          )}

          {doctor?.role === 'doctor' && (
            <>
              <div onClick={() => navigate('/patients')} className="bg-slate-50 border border-slate-200 hover:border-purple-400 p-6 rounded-2xl cursor-pointer transition-all shadow-sm group">
                <div className="bg-purple-100 text-purple-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800">Write Prescription</h3>
                <p className="text-xs text-slate-500 mt-1">Add medication details</p>
              </div>

              <div onClick={() => navigate('/patients')} className="bg-slate-50 border border-slate-200 hover:border-orange-400 p-6 rounded-2xl cursor-pointer transition-all shadow-sm group">
                <div className="bg-orange-100 text-orange-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <ClipboardList className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800">Patient Records</h3>
                <p className="text-xs text-slate-500 mt-1">Check past treatments</p>
              </div>
            </>
          )}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2 text-blue-600">
              <Users className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-slate-500 mb-1">Total Patients</p>
            <h2 className="text-3xl font-bold text-[#1B2559] mb-2">{patients.length}</h2>
            <p className="text-xs text-emerald-600 flex items-center gap-1"><TrendingUp className="w-3 h-3"/> Active records</p>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2 text-emerald-600">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-slate-500 mb-1">Today's Appointments</p>
            <h2 className="text-3xl font-bold text-[#1B2559] mb-2">{appointments.filter(a => a.date === new Date().toISOString().split('T')[0]).length || 0}</h2>
            <p className="text-xs text-slate-500 flex items-center gap-1">Total booked</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2 text-purple-600">
              <FileText className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-slate-500 mb-1">Patients Treated</p>
            <h2 className="text-3xl font-bold text-[#1B2559] mb-2">{patients.filter(p => p.prescriptions && p.prescriptions.length > 0).length}</h2>
            <p className="text-xs text-emerald-600 flex items-center gap-1">Received prescriptions</p>
          </div>
        </div>

        {/* Recent Patients Table */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col flex-1 min-h-[300px]">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="font-bold text-lg text-[#1B2559]">Recent Patients</h2>
            <button onClick={() => navigate('/patients')} className="text-blue-600 text-sm font-semibold hover:underline">View All →</button>
          </div>
          <div className="overflow-auto flex-1">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-500 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-4 font-medium">PID</th>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Age / Gender</th>
                  <th className="px-6 py-4 font-medium">Disease</th>
                  <th className="px-6 py-4 font-medium text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {patients.slice(0, 5).map(p => (
                  <tr key={p._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-[#004f6e]">{p.pid}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-blue-100 text-blue-600 rounded flex justify-center items-center font-bold text-xs shrink-0">
                          {p.name.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="font-semibold text-slate-800">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{p.age ? `${p.age} / ${p.gender}` : p.gender}</td>
                    <td className="px-6 py-4 text-slate-600 truncate max-w-[150px]">{p.disease || '-'}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Link to={`/patient/${p._id}`} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors tooltip" title="View Patient Details">
                          <Eye className="w-4 h-4" />
                        </Link>
                        {doctor?.role === 'doctor' && (
                          <>
                            <button onClick={() => handleEditClick(p)} className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors tooltip" title="Edit Data">
                              <Edit2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {doctor?.role === 'staff' && (
                          <>
                            <button onClick={() => navigate(`/patient/${p._id}`)} className="p-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors tooltip" title="Upload Reports">
                              <FileUp className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {patients.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-slate-500">No patients found. Click 'Add New Patient' to start.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Right Sidebar (Schedule) */}
      <div className="w-[340px] flex flex-col gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 flex-1 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-lg text-[#1B2559] flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-slate-400" /> Appointments
            </h2>
            <button onClick={() => navigate('/appointments')} className="text-blue-600 text-sm font-semibold hover:underline">View All →</button>
          </div>
          
          <div className="space-y-4 overflow-y-auto pr-2 flex-1">
            {appointments.length > 0 ? appointments.map((appt) => (
              <div key={appt._id} className="relative">
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-sm font-bold text-slate-800">{appt.name}</span>
                    <span className="text-xs font-semibold text-slate-500">{appt.timeSlot}</span>
                  </div>
                  <p className="text-xs text-slate-500">Token: <span className="font-semibold text-[#004f6e]">{appt.tokenNumber}</span> | {appt.phone}</p>
                </div>
              </div>
            )) : (
              <p className="text-sm text-slate-500 text-center py-4">No appointments scheduled.</p>
            )}
            </div>
          </div>
        </div>

      {/* Modals */}
      {showAddForm && <PatientForm onClose={() => setShowAddForm(false)} />}
      {editingPatient && <PatientForm initialData={editingPatient} onClose={() => { setEditingPatient(null); fetchData(); }} />}
      {showAppointmentForm && <AppointmentForm onClose={() => { setShowAppointmentForm(false); fetchData(); }} />}
    </div>
  );
};

export default Dashboard;
