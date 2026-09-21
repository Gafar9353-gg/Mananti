import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { X, Loader2 } from 'lucide-react';

const PatientForm = ({ onClose, initialData = null }) => {
  const { doctor } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    age: initialData?.age || '',
    gender: initialData?.gender || 'Male',
    contact: initialData?.contact || '',
    careOf: initialData?.careOf || '',
    location: initialData?.location || '',
    doctorName: initialData?.doctorName || (doctor?.role === 'staff' ? '' : doctor?.name || ''),
    dateOfVisit: initialData ? new Date(initialData.dateOfVisit).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    remarks: initialData?.remarks || ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${doctor.token}` } };
      if (initialData) {
        await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5005'}/api/patients/${initialData._id}`, formData, config);
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5005'}/api/patients`, formData, config);
      }
      onClose();
    } catch (error) {
      console.error(error);
      alert('Error saving patient');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-5 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">{initialData ? 'Update Patient Record' : 'Add New Patient'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
              <input required name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-blue-600/20 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Care of (C/o)</label>
              <input name="careOf" value={formData.careOf} onChange={handleChange} placeholder="Father / Husband / Mother's Name" className="w-full px-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-blue-600/20 outline-none" />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
                <input type="number" name="age" value={formData.age} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-blue-600/20 outline-none" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-blue-600/20 outline-none bg-white">
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Contact Number *</label>
              <input required name="contact" value={formData.contact} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-blue-600/20 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date of Visit</label>
              <input type="date" name="dateOfVisit" value={formData.dateOfVisit} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-blue-600/20 outline-none" />
            </div>
            
            <div className="grid grid-cols-2 col-span-full gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Doctor Name</label>
                <input name="doctorName" value={formData.doctorName} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-blue-600/20 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                <input name="location" value={formData.location} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-blue-600/20 outline-none" placeholder="City/Address" />
              </div>
            </div>

            <div className="col-span-full">
              <label className="block text-sm font-medium text-slate-700 mb-1">Remarks</label>
              <textarea rows="3" name="remarks" value={formData.remarks} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-blue-600/20 outline-none resize-none bg-slate-50" />
            </div>
          </div>
          
          <div className="mt-8 pt-5 border-t border-slate-100 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-2.5 font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {initialData ? 'Update Record' : 'Save Patient'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientForm;
