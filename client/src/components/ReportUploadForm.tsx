import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { X, Upload, Loader2, FileUp } from 'lucide-react';

const ReportUploadForm = ({ patientId, onClose }) => {
  const { doctor } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  
  const [file, setFile] = useState(null);
  const [reportType, setReportType] = useState('General Report');

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert('Please select a file');

    setLoading(true);
    const formData = new FormData();
    formData.append('patientId', patientId);
    formData.append('billType', reportType); // Keeping field as billType for backend compatibility
    formData.append('file', file);

    try {
      const config = { headers: { Authorization: `Bearer ${doctor.token}` } };
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5005'}/api/bills/upload`, formData, config);
      onClose();
    } catch (error) {
      console.error(error);
      alert('Error uploading report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <FileUp className="w-5 h-5 text-[#004f6e]" /> Upload Patient Report
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 bg-white hover:bg-slate-200 p-2 rounded-full transition-colors shadow-sm">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleUploadSubmit} className="p-6">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Report Type</label>
              <select value={reportType} onChange={(e) => setReportType(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-[#004f6e]/20 outline-none bg-white">
                <option>General Report</option>
                <option>Blood Test</option>
                <option>MRI / CT Scan</option>
                <option>X-Ray</option>
                <option>Psychological Assessment</option>
                <option>Prescription Copy</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Select File</label>
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors">
                <Upload className="h-8 w-8 text-slate-400 mx-auto mb-3" />
                <input 
                  type="file" 
                  onChange={(e) => setFile(e.target.files[0])} 
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                  accept="image/*,.pdf"
                />
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-2.5 font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading || !file} className="bg-[#004f6e] hover:bg-[#00394f] text-white px-6 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2 disabled:opacity-50">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Upload Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportUploadForm;
