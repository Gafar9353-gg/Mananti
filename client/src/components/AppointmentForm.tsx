import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { X, Loader2, Video, Copy, Check } from 'lucide-react';

const AppointmentForm = ({ onClose }) => {
  const { doctor } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [copied, setCopied] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '10:00 AM'
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${doctor.token}` } };
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/appointments`, formData, config);
      setSuccessData(data);
    } catch (error) {
      console.error(error);
      alert('Error booking appointment');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    const text = `Appointment Confirmed!\nName: ${successData.name}\nToken: ${successData.tokenNumber}\nDate: ${new Date(successData.date).toLocaleDateString()} at ${successData.timeSlot}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-5 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">Book Appointment</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {successData ? (
          <div className="p-6 text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-2">
              <Check className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Booking Confirmed!</h3>
            
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-left space-y-2 text-sm">
              <p><span className="text-slate-500">Patient:</span> <span className="font-semibold text-slate-800">{successData.name}</span></p>
              <p><span className="text-slate-500">Token ID:</span> <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">{successData.tokenNumber}</span></p>
              <p><span className="text-slate-500">Schedule:</span> <span className="font-semibold text-slate-800">{new Date(successData.date).toLocaleDateString()} @ {successData.timeSlot}</span></p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Patient Name *</label>
                <input required name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-blue-600/20 outline-none" placeholder="e.g. John Doe" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number *</label>
                <input required name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-blue-600/20 outline-none" placeholder="+1 234 567 8900" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Date *</label>
                  <input required type="date" name="date" value={formData.date} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-blue-600/20 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Time Slot *</label>
                  <select name="timeSlot" value={formData.timeSlot} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-blue-600/20 outline-none bg-white">
                    <option>09:00 AM</option>
                    <option>09:30 AM</option>
                    <option>10:00 AM</option>
                    <option>10:30 AM</option>
                    <option>11:00 AM</option>
                    <option>11:30 AM</option>
                    <option>02:00 PM</option>
                    <option>02:30 PM</option>
                    <option>03:00 PM</option>
                    <option>03:30 PM</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-end gap-3">
              <button type="button" onClick={onClose} className="px-5 py-2.5 font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="bg-[#004f6e] hover:bg-[#00394f] text-white px-6 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2">
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Confirm Booking
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AppointmentForm;
