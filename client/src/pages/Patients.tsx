import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, Edit2, FileUp, FileText, Info } from 'lucide-react';
import PatientForm from '../components/PatientForm';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { doctor } = useContext(AuthContext);
  const navigate = useNavigate();
  const [editingPatient, setEditingPatient] = useState(null);

  const fetchPatients = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${doctor.token}` } };
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5005'}/api/patients`, config);
      setPatients(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    (p.disease && p.disease.toLowerCase().includes(search.toLowerCase())) ||
    p.contact.includes(search)
  );

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#1B2559]">Patients Directory</h1>
          <p className="text-slate-500 mt-1">View and manage all your patients.</p>
        </div>
        <div>
          <input 
            type="text" 
            placeholder="Search by name, contact, disease..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 w-[300px] border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#004f6e]/20 outline-none"
          />
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex-1 flex flex-col">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading patients...</div>
        ) : (
          <div className="overflow-auto flex-1">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-500 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-4 font-medium">PID</th>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Contact</th>
                  <th className="px-6 py-4 font-medium">Age / Gender</th>
                  <th className="px-6 py-4 font-medium">Disease</th>
                  <th className="px-6 py-4 font-medium text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPatients.map(p => (
                  <tr key={p._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-[#004f6e]">{p.pid}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-blue-100 text-blue-600 rounded flex justify-center items-center font-bold text-xs shrink-0">
                          {p.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="flex items-center gap-2 relative group">
                          <span className="font-semibold text-slate-800">{p.name}</span>
                          <Info className="w-4 h-4 text-slate-400 hover:text-blue-500 cursor-help transition-colors" />
                          <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all bg-slate-800 text-white text-xs rounded-lg p-3 w-48 shadow-xl z-50 pointer-events-none">
                            <p className="font-bold mb-1 border-b border-slate-600 pb-1">Quick Info</p>
                            <div className="space-y-1 mt-2">
                              <p><span className="text-slate-400">Phone:</span> {p.contact}</p>
                              <p><span className="text-slate-400">Location:</span> {p.location || 'N/A'}</p>
                              <p><span className="text-slate-400">Last Visit:</span> {new Date(p.updatedAt || p.createdAt).toLocaleDateString('en-GB')}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{p.contact}</td>
                    <td className="px-6 py-4 text-slate-600">{p.age ? `${p.age} / ${p.gender}` : p.gender}</td>
                    <td className="px-6 py-4 text-slate-600 truncate max-w-[200px]">{p.disease || '-'}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Link to={`/patient/${p._id}`} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors tooltip" title="View Patient Details">
                          <Eye className="w-4 h-4" />
                        </Link>
                        {doctor?.role === 'doctor' && (
                          <>
                            <button onClick={() => setEditingPatient(p)} className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors tooltip" title="Edit Data">
                              <Edit2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {doctor?.role === 'staff' && (
                          <>
                            <button onClick={() => navigate(`/patient/${p._id}`)} className="p-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors tooltip" title="Upload Reports">
                              <FileUp className="w-4 h-4" />
                            </button>
                            <button onClick={() => navigate(`/patient/${p._id}`)} className="p-1.5 text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors tooltip" title="Generate Bill">
                              <FileText className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredPatients.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-slate-500">No patients match your search.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editingPatient && <PatientForm initialData={editingPatient} onClose={() => { setEditingPatient(null); fetchPatients(); }} />}
    </div>
  );
};

export default Patients;
