import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { X, Trash2, Loader2, ClipboardList, PlusCircle } from 'lucide-react';

const PrescriptionForm = ({ patientId, initialDisease, onClose, onPrescriptionSaved }) => {
  const { doctor } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [stockMedicines, setStockMedicines] = useState([]);
  
  const [disease, setDisease] = useState(initialDisease || '');
  const [nextVisit, setNextVisit] = useState('');
  const [medicines, setMedicines] = useState([
    { name: '', dosing: '1-0-1', days: '5' }
  ]);

  const nameInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${doctor.token}` } };
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5005'}/api/medicines`, config);
        setStockMedicines(data);
      } catch (error) {
        console.error("Could not load medicines for suggestions", error);
      }
    };
    fetchMedicines();
  }, [doctor.token]);

  const handleRemoveMedicine = (index) => {
    if (medicines.length <= 1) return;
    setMedicines(prev => prev.filter((_, i) => i !== index));
    setTimeout(() => {
      const prevIndex = Math.max(0, index - 1);
      nameInputRefs.current[prevIndex]?.focus();
    }, 50);
  };

  const handleMedicineChange = (index, field, value) => {
    const newMeds = [...medicines];
    newMeds[index][field] = value;
    setMedicines(newMeds);
  };

  const handleMedKeyDown = (e, index) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      const inputVal = (e.target as HTMLInputElement).value || medicines[index]?.name || '';
      if (!inputVal.trim()) {
        return;
      }

      // Sync name in state if entered via datalist or rapid typing
      if (medicines[index]?.name !== inputVal && (e.target as HTMLInputElement).name === 'name') {
        handleMedicineChange(index, 'name', inputVal);
      }

      if (index === medicines.length - 1) {
        // Last row: automatically add new row and focus its medicine name
        setMedicines(prev => [...prev, { name: '', dosing: '1-0-1', days: '5' }]);
        setTimeout(() => {
          nameInputRefs.current[index + 1]?.focus();
        }, 50);
      } else {
        // Not last row: jump focus to next row's medicine name
        nameInputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Filter out blank medicines if a new row was added but left empty
    const validMedicines = medicines.filter(m => m.name && m.name.trim() !== '');
    if (validMedicines.length === 0) {
      alert('Please enter at least one medicine');
      return;
    }

    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${doctor.token}` } };
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5005'}/api/patients/${patientId}/prescriptions`, {
        disease,
        medicines: validMedicines,
        nextVisit
      }, config);
      if (onPrescriptionSaved) {
        onPrescriptionSaved({ disease, medicines: validMedicines, nextVisit });
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
              <input 
                required 
                value={disease} 
                onChange={(e) => setDisease(e.target.value)} 
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    nameInputRefs.current[0]?.focus();
                  }
                }}
                className="w-full px-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-purple-600/20 outline-none" 
                placeholder="e.g. Viral Fever" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Next Visit (Optional)</label>
              <input 
                type="date" 
                value={nextVisit} 
                onChange={(e) => setNextVisit(e.target.value)} 
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    nameInputRefs.current[0]?.focus();
                  }
                }}
                className="w-full px-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-purple-600/20 outline-none" 
              />
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
              <h3 className="font-semibold text-slate-700">Medications</h3>
              <span className="text-xs text-slate-400 font-normal">Press Enter to add next row</span>
            </div>
            <div className="p-4 space-y-3">
              {medicines.map((med, index) => (
                <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 p-3 bg-slate-50 sm:bg-transparent rounded-xl border sm:border-0 border-slate-200">
                  <div className="flex-1 w-full min-w-0">
                    <label className="block sm:hidden text-[10px] font-bold text-slate-500 uppercase mb-1">Medicine Name</label>
                    <input 
                      ref={el => { nameInputRefs.current[index] = el; }}
                      name="name"
                      list="medicine-suggestions" 
                      required={index === 0 && medicines.length === 1} 
                      placeholder="Medicine Name + mg" 
                      value={med.name} 
                      onChange={(e) => handleMedicineChange(index, 'name', e.target.value)} 
                      onKeyDown={(e) => handleMedKeyDown(e, index)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-600/20 outline-none text-sm font-medium" 
                    />
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="flex-1 sm:w-32">
                      <label className="block sm:hidden text-[10px] font-bold text-slate-500 uppercase mb-1">Dosing</label>
                      <input 
                        name="dosing"
                        placeholder="1-0-1" 
                        value={med.dosing} 
                        onChange={(e) => handleMedicineChange(index, 'dosing', e.target.value)} 
                        onKeyDown={(e) => handleMedKeyDown(e, index)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-600/20 outline-none text-sm" 
                      />
                    </div>
                    <div className="flex-1 sm:w-24">
                      <label className="block sm:hidden text-[10px] font-bold text-slate-500 uppercase mb-1">Days</label>
                      <input 
                        name="days"
                        placeholder="Days" 
                        type="number" 
                        value={med.days} 
                        onChange={(e) => handleMedicineChange(index, 'days', e.target.value)} 
                        onKeyDown={(e) => handleMedKeyDown(e, index)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-600/20 outline-none text-sm" 
                      />
                    </div>
                    {medicines.length > 1 && (
                      <div className="self-end sm:self-auto pt-1 sm:pt-0">
                        <button 
                          type="button" 
                          onClick={() => handleRemoveMedicine(index)} 
                          className="text-red-400 hover:text-red-600 p-2 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                          title="Remove row"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Explicit button to add medicine row easily on touch phones */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const newIndex = medicines.length;
                    setMedicines([...medicines, { name: '', dosing: '1-0-1', days: '5' }]);
                    setTimeout(() => {
                      nameInputRefs.current[newIndex]?.focus();
                    }, 50);
                  }}
                  className="w-full py-2.5 px-4 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs rounded-xl border border-dashed border-purple-300 flex items-center justify-center gap-1.5 transition-colors active:scale-98"
                >
                  <PlusCircle className="w-4 h-4" /> + Add Medicine Row
                </button>
              </div>
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
