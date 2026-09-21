import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { X, Loader2, FileText, Printer } from 'lucide-react';

const BillingForm = ({ patient, onClose, initialPrescription }) => {
  const { doctor } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [printMode, setPrintMode] = useState(false);
  const [stockMedicines, setStockMedicines] = useState([]);
  
  // Get latest prescription if available
  const latestRx = patient.prescriptions && patient.prescriptions.length > 0 
    ? patient.prescriptions[patient.prescriptions.length - 1] 
    : null;

  const [items, setItems] = useState([]);
  const [gstPercent, setGstPercent] = useState(5);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${doctor.token}` } };
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5005'}/api/medicines`, config);
        setStockMedicines(data);

        setItems(prevItems => {
          if (prevItems.length > 0) return prevItems;
          
          const calculateQty = (dosing, days) => {
            if (!dosing || !days) return 1;
            const parts = String(dosing).split('-');
            const perDay = parts.reduce((sum, p) => sum + (parseFloat(p) || 0), 0);
            const d = parseFloat(days) || 0;
            return (perDay * d) || 1;
          };

          if (initialPrescription && initialPrescription.medicines) {
            return initialPrescription.medicines.map(rxMed => {
              const rxName = String(rxMed.name || '').trim().toLowerCase();
              const stockMed = data.find(m => String(m.name || '').trim().toLowerCase() === rxName);
              
              const qty = calculateQty(rxMed.dosing, rxMed.days);
              const price = stockMed ? (parseFloat(stockMed.mrp) || parseFloat(stockMed.rate) || 0) : 0;
              const calcAmount = price > 0 ? (qty * price).toFixed(2) : '';

              return {
                ...rxMed,
                batchNo: stockMed?.batch || '',
                expDate: stockMed?.exp || '',
                amount: calcAmount,
                quantity: qty // Send quantity to backend for stock deduction
              };
            });
          } else if (latestRx && latestRx.medicines) {
            return latestRx.medicines.map(med => ({
              ...med,
              batchNo: '',
              expDate: '',
              amount: '',
              quantity: 1
            }));
          }
          return [{ name: '', dosing: '', days: '', batchNo: '', expDate: '', amount: '', quantity: 1 }];
        });

      } catch (error) {
        console.error("Could not load medicines", error);
      }
    };
    fetchMedicines();
  }, [latestRx, initialPrescription, doctor.token]);

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    
    const calculateQty = (dosing, days) => {
      if (!dosing || !days) return 1;
      const parts = String(dosing).split('-');
      const perDay = parts.reduce((sum, p) => sum + (parseFloat(p) || 0), 0);
      const d = parseFloat(days) || 0;
      return (perDay * d) || 1;
    };

    // Auto-fill batch, exp, and amount if medicine name changes
    if (field === 'name') {
      const rxName = String(value || '').trim().toLowerCase();
      const stockMed = stockMedicines.find(m => String(m.name || '').trim().toLowerCase() === rxName);
      if (stockMed) {
        newItems[index].batchNo = stockMed.batch || newItems[index].batchNo;
        newItems[index].expDate = stockMed.exp || newItems[index].expDate;
        
        const qty = calculateQty(newItems[index].dosing, newItems[index].days);
        newItems[index].quantity = qty;

        const price = parseFloat(stockMed.mrp) || parseFloat(stockMed.rate) || 0;
        if (price > 0 && (!newItems[index].amount || newItems[index].amount === '')) {
          newItems[index].amount = (qty * price).toFixed(2);
        }
      }
    } else if (field === 'dosing' || field === 'days') {
      // Re-calculate quantity if dosing or days change
      const qty = calculateQty(newItems[index].dosing, newItems[index].days);
      newItems[index].quantity = qty;
      
      // If we know the price (from stock), we can auto-update amount
      const rxName = String(newItems[index].name || '').trim().toLowerCase();
      const stockMed = stockMedicines.find(m => String(m.name || '').trim().toLowerCase() === rxName);
      if (stockMed) {
        const price = parseFloat(stockMed.mrp) || parseFloat(stockMed.rate) || 0;
        if (price > 0) {
          newItems[index].amount = (qty * price).toFixed(2);
        }
      }
    }
    
    setItems(newItems);
  };

  const totalAmount = items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
  const subtotal = totalAmount; // Legacy support for backend
  const gstAmount = 0; // Legacy support for backend

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${doctor.token}` } };
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5005'}/api/bills/generate`, {
        patientId: patient._id,
        items,
        subtotal,
        gstAmount,
        totalAmount
      }, config);
      setPrintMode(true);
    } catch (error) {
      console.error(error);
      alert('Error generating bill');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    if (printMode) {
      setTimeout(() => {
        window.print();
      }, 500);
    }
  }, [printMode]);

  if (printMode) {
    return (
      <div className="fixed inset-0 bg-white z-[100] overflow-y-auto print:p-0 print:m-0 flex flex-col min-h-screen">
        <style>
          {`
            @media print {
              @page { size: A5 portrait; margin: 10mm; }
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
          `}
        </style>
        <div className="mx-auto bg-white p-4 print:shadow-none w-full max-w-2xl print:w-full print:p-0 flex-1 flex flex-col relative text-sm print:text-xs">
          
          {/* Header */}
          <div className="flex justify-center items-center mb-4 text-center">
            <div>
              <h1 className="text-2xl print:text-xl font-extrabold text-black tracking-wide uppercase">N. R. Acharya Hospital</h1>
              <p className="text-black font-bold text-base print:text-sm mt-1">Dr. Mahima Acharya</p>
              <p className="text-slate-600 text-xs print:text-[10px]">MBBS, MD Psychiatrist</p>
            </div>
          </div>

          {/* Title Banner */}
          <div className="flex justify-center mb-4">
            <div className="bg-white px-8 py-2 rounded-xl border-2 border-slate-800 text-center inline-block">
              <h2 className="text-lg print:text-base font-bold text-black tracking-wider m-0">MEDICAL BILL</h2>
              <div className="flex items-center gap-2 justify-center">
                <div className="h-px w-8 bg-black"></div>
                <p className="text-black text-[10px] font-semibold tracking-widest uppercase m-0">Patient Payment Receipt</p>
                <div className="h-px w-8 bg-black"></div>
              </div>
            </div>
          </div>
          
          {/* Patient Details Box */}
          <div className="bg-white border-2 border-slate-800 rounded-lg p-3 mb-4 flex justify-between text-xs print:text-[10px]">
            <div className="w-1/2 pr-2">
              <h3 className="font-bold text-black mb-2 uppercase">Patient Details</h3>
              <table className="w-full">
                <tbody>
                  <tr><td className="py-0.5 w-24 text-slate-700">Patient Name</td><td className="py-0.5 font-semibold text-black">: {patient.name}</td></tr>
                  <tr><td className="py-0.5 text-slate-700">PID / UHID</td><td className="py-0.5 font-semibold text-black">: {patient.pid}</td></tr>
                  <tr><td className="py-0.5 text-slate-700">Doctor</td><td className="py-0.5 font-semibold text-black">: Dr. Mahima Acharya</td></tr>
                </tbody>
              </table>
            </div>
            <div className="w-1/2 pl-4 border-l-2 border-slate-800">
              <table className="w-full mt-6">
                <tbody>
                  <tr><td className="py-0.5 w-16 text-slate-700">Bill No.</td><td className="py-0.5 font-semibold text-black">: B-{Date.now().toString().slice(-6)}</td></tr>
                  <tr><td className="py-0.5 text-slate-700">Date</td><td className="py-0.5 font-semibold text-black">: {new Date().toLocaleDateString('en-GB')}</td></tr>
                  <tr><td className="py-0.5 text-slate-700">Time</td><td className="py-0.5 font-semibold text-black">: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Table */}
          <div className="border-2 border-slate-800 rounded-md overflow-hidden mb-4">
            <table className="w-full text-left text-xs print:text-[9px] border-collapse">
              <thead>
                <tr className="bg-slate-100 text-black border-b-2 border-slate-800">
                  <th className="p-1.5 border-r border-slate-800 font-bold text-center w-8">Sl.</th>
                  <th className="p-1.5 border-r border-slate-800 font-bold text-center">Medicine Name + mg.</th>
                  <th className="p-1.5 border-r border-slate-800 font-bold text-center w-14">Dosing</th>
                  <th className="p-1.5 border-r border-slate-800 font-bold text-center w-10">Days</th>
                  <th className="p-1.5 border-r border-slate-800 font-bold text-center w-8">Qty</th>
                  <th className="p-1.5 border-r border-slate-800 font-bold text-center w-14">Batch No.</th>
                  <th className="p-1.5 border-r border-slate-800 font-bold text-center w-14">Exp.</th>
                  <th className="p-1.5 font-bold text-center w-16">Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={idx} className="border-b border-slate-300 last:border-b-0">
                    <td className="p-1.5 border-r border-slate-300 text-center text-black">{idx + 1}</td>
                    <td className="p-1.5 border-r border-slate-300 font-bold text-black break-words">{item.name}</td>
                    <td className="p-1.5 border-r border-slate-300 text-center text-black">{item.dosing}</td>
                    <td className="p-1.5 border-r border-slate-300 text-center text-black">{item.days}</td>
                    <td className="p-1.5 border-r border-slate-300 text-center font-bold text-black">{item.quantity}</td>
                    <td className="p-1.5 border-r border-slate-300 text-center text-black">{item.batchNo}</td>
                    <td className="p-1.5 border-r border-slate-300 text-center text-black break-all">{item.expDate}</td>
                    <td className="p-1.5 text-right font-semibold text-black">{parseFloat(item.amount || 0).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* Totals Section */}
            <div className="flex justify-end border-t-2 border-slate-800">
              <div className="w-40 print:w-32 border-l-2 border-slate-800">
                <div className="flex justify-between p-1.5 border-b border-slate-300 text-xs print:text-[10px] text-black">
                  <span>Subtotal</span>
                  <span>₹ {totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between p-1.5 border-b border-slate-300 text-xs print:text-[10px] text-black">
                  <span>Discount</span>
                  <span>₹ 0.00</span>
                </div>
                <div className="flex justify-between p-1.5 bg-slate-100 font-bold text-black text-sm print:text-xs">
                  <span>Total</span>
                  <span>₹ {totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section - Generated By */}
          <div className="mt-8 flex justify-end items-center px-4">
            <div className="flex items-center gap-1.5 text-[10px] print:text-[8px] text-slate-500">
              <span>Generated by</span>
              <img src="/aganix-logo.jpg" alt="Aganix Logo" className="h-4 object-contain grayscale opacity-60" />
            </div>
          </div>

        </div>

        <div className="fixed bottom-4 right-4 flex justify-center gap-4 print:hidden z-50">
          <button onClick={onClose} className="px-6 py-2 bg-slate-800 text-white shadow-lg rounded-lg font-bold">Close Preview</button>
          <button onClick={handlePrint} className="px-6 py-2 bg-[#1e5b87] shadow-lg text-white rounded-lg font-bold flex items-center gap-2">
            <Printer className="w-5 h-5" /> Print Bill
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50">
          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <FileText className="w-5 h-5 text-orange-600" /> Generate Patient Bill
            </h2>
            <p className="text-sm text-slate-500 mt-1">Patient: <span className="font-bold text-[#004f6e]">{patient.pid}</span> - {patient.name}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 bg-white hover:bg-slate-200 p-2 rounded-full transition-colors shadow-sm">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1">
          <datalist id="billing-medicine-suggestions">
            {stockMedicines.map((med) => (
              <option key={med._id} value={med.name} />
            ))}
          </datalist>

          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="p-3 font-semibold">Medicine Name </th>
                  <th className="p-3 font-semibold w-24">Dosing 1-0-1</th>
                  <th className="p-3 font-semibold w-24 text-center">Days (Duration)</th>
                  <th className="p-3 font-semibold w-20 text-center">Qty</th>
                  <th className="p-3 font-semibold w-32">Batch No.</th>
                  <th className="p-3 font-semibold w-32">Exp. Date</th>
                  <th className="p-3 font-semibold w-32 text-right">GST + Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="p-2"><input list="billing-medicine-suggestions" required value={item.name} onChange={(e) => handleItemChange(idx, 'name', e.target.value)} className="w-full px-2 py-1.5 border rounded outline-none focus:border-orange-400" /></td>
                    <td className="p-2"><input required value={item.dosing} onChange={(e) => handleItemChange(idx, 'dosing', e.target.value)} className="w-full px-2 py-1.5 border rounded outline-none focus:border-orange-400" /></td>
                    <td className="p-2"><input required value={item.days} onChange={(e) => handleItemChange(idx, 'days', e.target.value)} className="w-full px-2 py-1.5 border rounded outline-none focus:border-orange-400 text-center" /></td>
                    <td className="p-2 text-center font-bold text-slate-700">{item.quantity}</td>
                    <td className="p-2"><input required placeholder="B-123" value={item.batchNo} onChange={(e) => handleItemChange(idx, 'batchNo', e.target.value)} className="w-full px-2 py-1.5 border rounded outline-none focus:border-orange-400" /></td>
                    <td className="p-2"><input required placeholder="MM/YY" value={item.expDate} onChange={(e) => handleItemChange(idx, 'expDate', e.target.value)} className="w-full px-2 py-1.5 border rounded outline-none focus:border-orange-400" /></td>
                    <td className="p-2"><input required type="number" step="0.01" placeholder="0.00" value={item.amount} onChange={(e) => handleItemChange(idx, 'amount', e.target.value)} className="w-full px-2 py-1.5 border rounded outline-none focus:border-orange-400 text-right font-medium" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end">
               <button type="button" onClick={() => setItems([...items, { name: '', dosing: '', days: '', batchNo: '', expDate: '', amount: '' }])} className="text-sm text-blue-600 font-semibold hover:underline">
                 + Add Item Manually
               </button>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <div className="w-72 bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-800 text-lg">Total</span>
                <span className="font-bold text-orange-600 text-xl">₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-2.5 font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2 disabled:opacity-50 shadow-md">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Save & Print Bill
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BillingForm;
