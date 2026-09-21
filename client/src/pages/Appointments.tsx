import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { SocketContext } from '../context/SocketContext';
import { CalendarIcon } from 'lucide-react';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const { doctor } = useContext(AuthContext);
  const socket = useContext(SocketContext);

  const fetchData = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${doctor.token}` } };
      const [apptRes, patRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/api/appointments`, config),
        axios.get(`${import.meta.env.VITE_API_URL}/api/patients`, config)
      ]);
      setAppointments(apptRes.data);
      setPatients(patRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('patient_added', (newPatient) => {
        setPatients(prev => [newPatient, ...prev]);
      });
      socket.on('patient_updated', (updatedPatient) => {
        setPatients(prev => prev.map(p => p._id === updatedPatient._id ? updatedPatient : p));
      });
      socket.on('appointment_added', (newAppt) => {
        setAppointments(prev => [newAppt, ...prev]);
      });
      socket.on('appointment_updated', (updatedAppt) => {
        setAppointments(prev => prev.map(a => a._id === updatedAppt._id ? updatedAppt : a));
      });
    }
    return () => {
      if (socket) {
        socket.off('patient_added');
        socket.off('patient_updated');
        socket.off('appointment_added');
        socket.off('appointment_updated');
      }
    };
  }, [socket]);

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1B2559]">Appointments Directory</h1>
        <p className="text-slate-500 mt-1">View all scheduled appointments.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex-1 flex flex-col">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading appointments...</div>
        ) : (
          <div className="overflow-auto flex-1">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-500 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-4 font-medium">Token ID</th>
                  <th className="px-6 py-4 font-medium">Patient Name</th>
                  <th className="px-6 py-4 font-medium">Contact Phone</th>
                  <th className="px-6 py-4 font-medium">Schedule</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {appointments.map(appt => {
                  const isAdded = patients.some(p => 
                    p.contact === appt.phone || 
                    p.name.toLowerCase().trim() === appt.name.toLowerCase().trim()
                  );
                  return (
                    <tr key={appt._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-bold text-[#004f6e] bg-blue-50 px-3 py-1 rounded-md">{appt.tokenNumber}</span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-800">{appt.name}</td>
                      <td className="px-6 py-4 text-slate-600">{appt.phone}</td>
                      <td className="px-6 py-4 text-slate-600">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="w-4 h-4 text-slate-400" />
                          {new Date(appt.date).toLocaleDateString('en-GB')} at {appt.timeSlot}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {isAdded ? (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                            Patient Added
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                            Not Added
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {appointments.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-slate-500">No appointments scheduled.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointments;
