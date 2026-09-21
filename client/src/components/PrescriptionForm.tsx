import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { X, Plus, Trash2, Loader2, ClipboardList } from 'lucide-react';

const PrescriptionForm = ({ patientId, initialDisease, onClose, onPrescriptionSaved }) => {
  const { doctor } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [stockMedicines, setStockMedicines] = useState([]);
  
  const [disease, setDisease] = useState(initialDisease || '');
  const [nextVisit, setNextVisit] = useState('');
  const [medicines, setMedicines] = useState([
    { name: '', dosing: '1-0-1', days: '5' }
  ]);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${doctor.token}` } };
        const { data } = await axios.get('http://localhost:5005/api/medicines', config);
        setStockMedicines(data);
      } catch (error) {
        console.error("Could not load medicines for suggestions", error);
      }
    };
    fetchMedicines();
  }, [doctor.token]);

  const handleAddMedicine = () => {
    setMedicines([...medicines, { name: '', dosing: '1-0-1', days: '5' }]);
  };

  const handleRemoveMedicine = (index) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleMedicineChange = (index, field, value) => {
    const newMeds = [...medicines];
    newMeds[index][field] = value;
    setMedicines(newMeds);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${doctor.token}` } };
      await axios.post(`http://localhost:5005/api/patients/${patientId}/prescriptions`, {
        disease,
        medicines,
        nextVisit
      }, config);
      if (onPrescriptionSaved) {
        onPrescriptionSaved({ disease, medicines, nextVisit });
      } else {
        onClose();
      }
    } catch (error) {
      console.error(error);
      alert('Error saving prescription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-purple-600" /> Write Prescription
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 bg-white hover:bg-slate-200 p-2 rounded-full transition-colors shadow-sm">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1">
          
          <datalist id="medicine-suggestions">
            {stockMedicines.map((med) => (
              <option key={med._id} value={med.name} />
            ))}
          </datalist>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Diagnosis / Disease</label>
              <input required value={disease} onChange={(e) => setDisease(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-purple-600/20 outline-none" placeholder="e.g. Viral Fever" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Next Visit (Optional)</label>
              <input type="date" value={nextVisit} onChange={(e) => setNextVisit(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-purple-600/20 outline-none" />
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
              <h3 className="font-semibold text-slate-700">Medications</h3>
              <button type="button" onClick={handleAddMedicine} className="text-sm bg-white border border-slate-200 text-purple-600 px-3 py-1.5 rounded-lg font-medium hover:bg-purple-50 transition-colors flex items-center gap-1">
                <Plus className="w-4 h-4" /> Add Row
              </button>
            </div>
            <div className="p-4 space-y-3">
              {medicines.map((med, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex-1">
                    <input list="medicine-suggestions" required placeholder="Medicine Name + mg" value={med.name} onChange={(e) => handleMedicineChange(index, 'name', e.target.value)} className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-purple-600/20 outline-none text-sm" />
                  </div>
                  <div className="w-32">
                    <input required placeholder="1-0-1" value={med.dosing} onChange={(e) => handleMedicineChange(index, 'dosing', e.target.value)} className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-purple-600/20 outline-none text-sm" />
                  </div>
                  <div className="w-24">
                    <input required placeholder="Days" type="number" value={med.days} onChange={(e) => handleMedicineChange(index, 'days', e.target.value)} className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-purple-600/20 outline-none text-sm" />
                  </div>
                  {medicines.length > 1 && (
                    <button type="button" onClick={() => handleRemoveMedicine(index)} className="text-red-400 hover:text-red-600 p-2 bg-red-50 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-8 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-2.5 font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2 disabled:opacity-50">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Save Prescription
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PrescriptionForm;
