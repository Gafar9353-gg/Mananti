import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { PackageSearch, PlusCircle, Save, AlertTriangle, Edit2, Loader2, X, FileText, Eye } from 'lucide-react';

const StockManagement = () => {
  const { doctor } = useContext(AuthContext);
  const [medicines, setMedicines] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('stock'); // 'stock' | 'entry'

  // Medicine Add/Edit State
  const [editingMed, setEditingMed] = useState(null);
  const [medFormData, setMedFormData] = useState({ name: '', pack: '', batch: '', exp: '', stock: '', mrp: '', gst: '5' });
  const [isMedModalOpen, setIsMedModalOpen] = useState(false);

  // Purchase Entry State
  const [invoiceNo, setInvoiceNo] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [vendor, setVendor] = useState('');
  
  const getEmptyItem = () => ({
    qty: '', free: '', mfr: '', pack: '', name: '', batch: '', exp: '', 
    hsn: '', mrp: '', rate: '', dis: '', sgstPercent: '2.5', cgstPercent: '2.5', 
    sgstValue: '0.00', cgstValue: '0.00', amount: '0.00'
  });

  const [items, setItems] = useState([getEmptyItem()]);
  const [summary, setSummary] = useState({ totalAmount: '0.00', disAmt: '0.00', sgstPayable: '0.00', cgstPayable: '0.00', grandTotal: '0.00' });

  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [saving, setSaving] = useState(false);
  const [viewPurchasesModal, setViewPurchasesModal] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  
  // Payment State
  const [paymentModal, setPaymentModal] = useState(null);

  const fetchMedicines = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${doctor.token}` } };
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5005'}/api/medicines`, config);
      setMedicines(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPurchases = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${doctor.token}` } };
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5005'}/api/medicines/purchases`, config);
      setPurchases(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMedicines();
    fetchPurchases();
  }, [doctor.token]);

  const openMedModal = (med = null) => {
    setEditingMed(med);
    if (med) {
      const gst = ((med.sgstPercent || 0) + (med.cgstPercent || 0)).toString();
      setMedFormData({ name: med.name, pack: med.pack || '', batch: med.batch || '', exp: med.exp || '', stock: med.stock, mrp: med.mrp || '', gst });
    } else {
      setMedFormData({ name: '', pack: '', batch: '', exp: '', stock: '', mrp: '', gst: '5' });
    }
    setIsMedModalOpen(true);
  };

  const handleSaveMedicine = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${doctor.token}` } };
      let res;
      
      const payload = {
        ...medFormData,
        sgstPercent: parseFloat(medFormData.gst || 0) / 2,
        cgstPercent: parseFloat(medFormData.gst || 0) / 2,
      };

      if (editingMed) {
        res = await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5005'}/api/medicines/${editingMed._id}`, payload, config);
      } else {
        res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5005'}/api/medicines`, payload, config);
      }
      setMedicines(res.data);
      setIsMedModalOpen(false);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save medicine');
    }
  };

  const handleMarkPaid = async () => {
    if (!paymentModal) return;
    try {
      const config = { headers: { Authorization: `Bearer ${doctor.token}` } };
      const { data } = await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5005'}/api/medicines/purchase/${paymentModal._id}/pay`, {}, config);
      
      setPurchases(purchases.map(p => p._id === data._id ? data : p));
      setPaymentModal(null);
      alert('Payment successful');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to mark as paid');
    }
  };

  const calculateSummary = (currentItems) => {
    let totalAmount = 0;
    let disAmt = 0;
    let sgstPayable = 0;
    let cgstPayable = 0;

    currentItems.forEach(item => {
      totalAmount += parseFloat(item.amount) || 0;
      disAmt += parseFloat(item.dis) || 0;
      sgstPayable += parseFloat(item.sgstValue) || 0;
      cgstPayable += parseFloat(item.cgstValue) || 0;
    });

    const grandTotal = totalAmount + sgstPayable + cgstPayable;
    
    setSummary({
      totalAmount: totalAmount.toFixed(2),
      disAmt: disAmt.toFixed(2),
      sgstPayable: sgstPayable.toFixed(2),
      cgstPayable: cgstPayable.toFixed(2),
      grandTotal: grandTotal.toFixed(2)
    });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    
    // Auto-fill if a known medicine is selected
    if (field === 'name') {
      const existingMed = medicines.find(m => m.name.toLowerCase() === value.toLowerCase());
      if (existingMed) {
        newItems[index].pack = existingMed.pack || newItems[index].pack;
        newItems[index].mrp = existingMed.mrp || newItems[index].mrp;
        newItems[index].rate = existingMed.rate || newItems[index].rate;
        newItems[index].batch = existingMed.batch || newItems[index].batch;
        newItems[index].exp = existingMed.exp || newItems[index].exp;
      }
    }

    // Auto-calculate amounts when relevant fields change
    if (['qty', 'rate', 'dis', 'sgstPercent', 'cgstPercent', 'name'].includes(field)) {
      const q = parseFloat(newItems[index].qty) || 0;
      const r = parseFloat(newItems[index].rate) || 0;
      const d = parseFloat(newItems[index].dis) || 0;
      
      const amount = (q * r) - d;
      newItems[index].amount = amount > 0 ? amount.toFixed(2) : '0.00';
      
      const sgstP = parseFloat(newItems[index].sgstPercent) || 0;
      const cgstP = parseFloat(newItems[index].cgstPercent) || 0;
      
      newItems[index].sgstValue = (parseFloat(newItems[index].amount) * (sgstP / 100)).toFixed(2);
      newItems[index].cgstValue = (parseFloat(newItems[index].amount) * (cgstP / 100)).toFixed(2);
    }
    
    setItems(newItems);
    calculateSummary(newItems);
  };

  const handleRemoveItem = (index) => {
    if (items.length === 1) return;
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    calculateSummary(newItems);
  };

  const handlePurchaseEntry = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    setSaving(true);
    
    try {
      const config = { headers: { Authorization: `Bearer ${doctor.token}` } };
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5005'}/api/medicines/purchase`, {
        invoiceNo,
        invoiceDate,
        vendor,
        items,
        summary
      }, config);
      
      setMedicines(data.medicines);
      setPurchases([...purchases, data.purchase]);
      setSuccessMsg(`Successfully saved purchase entry!`);
      setInvoiceNo('');
      setVendor('');
      setItems([getEmptyItem()]);
      calculateSummary([getEmptyItem()]);
      setActiveTab('stock');
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Failed to save invoice');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading stock data...</div>;

  const lowStockThreshold = 20;
  const lowStockCount = medicines.filter(m => m.stock > 0 && m.stock <= lowStockThreshold).length;

  return (
    <div className="flex flex-col h-full bg-slate-50 p-3 sm:p-6 rounded-2xl relative w-full max-w-full min-w-0">
      <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 flex flex-wrap items-center gap-2 sm:gap-3">
            <PackageSearch className="w-7 h-7 sm:w-8 sm:h-8 text-[#004f6e]" /> Stock Management
            {lowStockCount > 0 && (
              <span className="bg-orange-100 text-orange-700 text-xs sm:text-sm font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-orange-200">
                <AlertTriangle className="w-3.5 h-3.5" /> {lowStockCount} Low Stock
              </span>
            )}
          </h1>
          <p className="text-slate-500 mt-1 text-xs sm:text-sm">Track medicine inventory and add purchase entries.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <div className="bg-white border border-slate-200 rounded-xl p-1 flex">
            <button 
              onClick={() => setActiveTab('stock')}
              className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${activeTab === 'stock' ? 'bg-[#004f6e] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              Current Stock
            </button>
            <button 
              onClick={() => setActiveTab('entry')}
              className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 ${activeTab === 'entry' ? 'bg-[#004f6e] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <FileText className="w-3.5 h-3.5" /> Purchase Entry
            </button>
          </div>
          {activeTab === 'stock' && (
            <button 
              onClick={() => openMedModal()}
              className="bg-[#004f6e] text-white hover:bg-[#00394f] px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <PlusCircle className="w-4 h-4" /> Add Medicine
            </button>
          )}
        </div>
      </div>

      {activeTab === 'stock' ? (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex-1 flex flex-col overflow-hidden w-full max-w-full">
          <div className="overflow-x-auto overflow-y-auto flex-1 w-full max-w-full">
            <table className="w-full text-left text-sm whitespace-nowrap min-w-[680px]">
              <thead className="bg-slate-50 text-slate-500 sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="px-6 py-4 font-semibold">Medicine Name</th>
                  <th className="px-6 py-4 font-semibold">Pack</th>
                  <th className="px-6 py-4 font-semibold">Batch</th>
                  <th className="px-6 py-4 font-semibold">Exp</th>
                  <th className="px-6 py-4 font-semibold">Current Stock</th>
                  <th className="px-6 py-4 font-semibold text-center">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {medicines.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-slate-500">No medicines in inventory. Add a purchase entry.</td>
                  </tr>
                ) : (
                  medicines.map((med, idx) => {
                    const isLow = med.stock > 0 && med.stock <= lowStockThreshold;
                    const isOut = med.stock === 0;
                    return (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-700">{med.name}</td>
                        <td className="px-6 py-4 text-slate-500">{med.pack || '-'}</td>
                        <td className="px-6 py-4 text-slate-500">{med.batch || '-'}</td>
                        <td className="px-6 py-4 text-slate-500">{med.exp || '-'}</td>
                        <td className="px-6 py-4">
                          <span className={`font-bold text-lg ${isOut ? 'text-red-600' : isLow ? 'text-orange-500' : 'text-slate-700'}`}>
                            {med.stock}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {isOut ? (
                            <span className="inline-flex items-center gap-1 bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold border border-red-100">
                              <AlertTriangle className="w-3 h-3" /> Out of Stock
                            </span>
                          ) : isLow ? (
                            <span className="inline-flex items-center gap-1 bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-xs font-bold border border-orange-100">
                              <AlertTriangle className="w-3 h-3" /> Low Stock
                            </span>
                          ) : (
                            <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold border border-emerald-100">
                              In Stock
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => openMedModal(med)}
                            className="p-2 text-slate-400 hover:text-[#004f6e] hover:bg-slate-100 rounded-lg transition-colors inline-flex"
                            title="Edit Medicine"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex-1 flex flex-col p-4 sm:p-6 overflow-hidden w-full max-w-full">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-[#004f6e]" /> New GST Purchase Entry
            </h2>
            <button 
              onClick={() => setViewPurchasesModal(true)}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors flex items-center gap-2 text-xs sm:text-sm w-fit"
            >
              <FileText className="w-4 h-4" /> View Purchase Entries
            </button>
          </div>
          
          {successMsg && <div className="bg-emerald-50 text-emerald-600 p-4 rounded-xl text-sm mb-4 border border-emerald-100">{successMsg}</div>}
          {errorMsg && <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-4 border border-red-100">{errorMsg}</div>}

          <form onSubmit={handlePurchaseEntry} className="w-full flex flex-col gap-4 overflow-visible">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-2">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wide">Invoice No.</label>
                <input
                  type="text"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#004f6e]/20 focus:border-[#004f6e] outline-none text-sm font-semibold"
                  value={invoiceNo}
                  onChange={(e) => setInvoiceNo(e.target.value)}
                  placeholder="e.g. B0005943"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wide">Invoice Date</label>
                <input
                  type="date"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#004f6e]/20 focus:border-[#004f6e] outline-none text-sm font-semibold"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                />
              </div>
              <div className="sm:col-span-2 md:col-span-1">
                <label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wide">Party / Vendor Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#004f6e]/20 focus:border-[#004f6e] outline-none text-sm font-semibold"
                  value={vendor}
                  onChange={(e) => setVendor(e.target.value)}
                  placeholder="e.g. BHARANI ENTERPRISES"
                  required
                />
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-x-auto overflow-y-auto min-h-[260px] max-h-[500px] flex flex-col w-full shadow-inner bg-white">
              <table className="w-full text-left text-xs whitespace-nowrap min-w-[980px]">
                <thead className="bg-slate-100 text-slate-700 sticky top-0 z-10 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="p-2.5 font-bold w-12 text-center">S.</th>
                    <th className="p-2.5 font-bold w-16">Qty</th>
                    <th className="p-2.5 font-bold w-16">Free</th>
                    <th className="p-2.5 font-bold w-16">Mfr</th>
                    <th className="p-2.5 font-bold w-16">Pack</th>
                    <th className="p-2.5 font-bold min-w-[180px]">Product Name</th>
                    <th className="p-2.5 font-bold w-24">Batch</th>
                    <th className="p-2.5 font-bold w-20">Exp</th>
                    <th className="p-2.5 font-bold w-20">HSN</th>
                    <th className="p-2.5 font-bold w-20">M.R.P</th>
                    <th className="p-2.5 font-bold w-20">Rate</th>
                    <th className="p-2.5 font-bold w-16">Dis %</th>
                    <th className="p-2.5 font-bold w-16">SGST %</th>
                    <th className="p-2.5 font-bold w-20">SGST Val</th>
                    <th className="p-2.5 font-bold w-16">CGST %</th>
                    <th className="p-2.5 font-bold w-20">CGST Val</th>
                    <th className="p-2.5 font-bold w-24 text-right">Amount</th>
                    <th className="p-2.5 font-bold w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-1.5 text-center font-bold text-slate-400">{idx + 1}</td>
                      <td className="p-1.5"><input type="number" required value={item.qty} onChange={(e) => handleItemChange(idx, 'qty', e.target.value)} className="w-14 px-2 py-1.5 border rounded-lg outline-none focus:border-[#004f6e]" /></td>
                      <td className="p-1.5"><input type="number" value={item.free} onChange={(e) => handleItemChange(idx, 'free', e.target.value)} className="w-14 px-2 py-1.5 border rounded-lg outline-none focus:border-[#004f6e]" /></td>
                      <td className="p-1.5"><input value={item.mfr} onChange={(e) => handleItemChange(idx, 'mfr', e.target.value)} className="w-16 px-2 py-1.5 border rounded-lg outline-none focus:border-[#004f6e]" /></td>
                      <td className="p-1.5"><input value={item.pack} onChange={(e) => handleItemChange(idx, 'pack', e.target.value)} className="w-16 px-2 py-1.5 border rounded-lg outline-none focus:border-[#004f6e]" /></td>
                      <td className="p-1.5">
                        <datalist id="med-suggestions">
                          {medicines.map((m) => (
                            <option key={m._id} value={m.name} />
                          ))}
                        </datalist>
                        <input list="med-suggestions" required value={item.name} onChange={(e) => handleItemChange(idx, 'name', e.target.value)} className="w-full min-w-[160px] px-2 py-1.5 border rounded-lg outline-none focus:border-[#004f6e] font-semibold text-slate-800" placeholder="Medicine Name" />
                      </td>
                      <td className="p-1.5"><input value={item.batch} onChange={(e) => handleItemChange(idx, 'batch', e.target.value)} className="w-20 px-2 py-1.5 border rounded-lg outline-none focus:border-[#004f6e]" placeholder="Batch" /></td>
                      <td className="p-1.5"><input value={item.exp} onChange={(e) => handleItemChange(idx, 'exp', e.target.value)} className="w-20 px-2 py-1.5 border rounded-lg outline-none focus:border-[#004f6e]" placeholder="MM/YY" /></td>
                      <td className="p-1.5"><input value={item.hsn} onChange={(e) => handleItemChange(idx, 'hsn', e.target.value)} className="w-20 px-2 py-1.5 border rounded-lg outline-none focus:border-[#004f6e]" /></td>
                      <td className="p-1.5"><input type="number" step="0.01" value={item.mrp} onChange={(e) => handleItemChange(idx, 'mrp', e.target.value)} className="w-20 px-2 py-1.5 border rounded-lg outline-none focus:border-[#004f6e]" /></td>
                      <td className="p-1.5"><input type="number" step="0.01" value={item.rate} onChange={(e) => handleItemChange(idx, 'rate', e.target.value)} className="w-20 px-2 py-1.5 border rounded-lg outline-none focus:border-[#004f6e]" /></td>
                      <td className="p-1.5"><input type="number" step="0.01" value={item.dis} onChange={(e) => handleItemChange(idx, 'dis', e.target.value)} className="w-16 px-2 py-1.5 border rounded-lg outline-none focus:border-[#004f6e]" /></td>
                      <td className="p-1.5"><input type="number" step="0.01" value={item.sgstPercent} onChange={(e) => handleItemChange(idx, 'sgstPercent', e.target.value)} className="w-16 px-2 py-1.5 border rounded-lg outline-none focus:border-[#004f6e]" /></td>
                      <td className="p-1.5"><input type="number" step="0.01" readOnly value={item.sgstValue} className="w-20 px-2 py-1.5 border border-transparent bg-transparent outline-none text-slate-500 font-medium" /></td>
                      <td className="p-1.5"><input type="number" step="0.01" value={item.cgstPercent} onChange={(e) => handleItemChange(idx, 'cgstPercent', e.target.value)} className="w-16 px-2 py-1.5 border rounded-lg outline-none focus:border-[#004f6e]" /></td>
                      <td className="p-1.5"><input type="number" step="0.01" readOnly value={item.cgstValue} className="w-20 px-2 py-1.5 border border-transparent bg-transparent outline-none text-slate-500 font-medium" /></td>
                      <td className="p-1.5"><input type="number" step="0.01" readOnly value={item.amount} className="w-24 px-2 py-1.5 border border-transparent bg-transparent outline-none text-right font-bold text-slate-800" /></td>
                      <td className="p-1.5 text-center">
                        {items.length > 1 && (
                          <button type="button" onClick={() => handleRemoveItem(idx)} className="text-slate-300 hover:text-red-500 transition-colors p-1" title="Remove Row">
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="bg-slate-50 p-2.5 border-t border-b border-slate-200 flex items-center justify-between">
                <button type="button" onClick={() => setItems([...items, getEmptyItem()])} className="text-xs text-white bg-[#004f6e] hover:bg-[#00394f] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm active:scale-95">
                  <PlusCircle className="w-3.5 h-3.5" /> + Add Another Row
                </button>
                <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">Scroll horizontally to view GST & Amounts →</span>
              </div>

              {/* Invoice Footer / Totals */}
              <div className="bg-white p-4 text-xs sm:text-sm font-semibold text-slate-700 flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex gap-8">
                   <div>
                     <span className="text-xs text-slate-500 block uppercase tracking-wide">Total Items</span>
                     <span className="text-lg font-bold text-[#004f6e]">{items.length}</span>
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-x-8 gap-y-1.5 text-right text-xs sm:text-sm">
                  <div className="text-slate-500">TOTAL</div>
                  <div>₹{summary.totalAmount}</div>
                  <div className="text-slate-500">DIS AMT.</div>
                  <div>₹{summary.disAmt}</div>
                  <div className="text-slate-500">SGST PAYABLE</div>
                  <div>₹{summary.sgstPayable}</div>
                  <div className="text-slate-500">CGST PAYABLE</div>
                  <div>₹{summary.cgstPayable}</div>
                  <div className="text-slate-800 font-bold text-sm sm:text-base mt-2 pt-2 border-t border-slate-200">GRAND TOTAL</div>
                  <div className="text-[#004f6e] font-bold text-base sm:text-xl mt-2 pt-2 border-t border-slate-200">₹{summary.grandTotal}</div>
                </div>
              </div>
            </div>

            <div className="mt-2 flex justify-end gap-3 w-full">
              <button
                type="submit"
                disabled={saving}
                className="w-full sm:w-auto bg-[#004f6e] hover:bg-[#00394f] text-white px-8 py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-70 active:scale-98 text-sm"
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Save Purchase Invoice
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add / Edit Medicine Modal */}
      {isMedModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-800 text-lg">{editingMed ? 'Edit Medicine Details' : 'Add New Medicine'}</h3>
              <button onClick={() => setIsMedModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSaveMedicine}>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Medicine Name *</label>
                  <input 
                    type="text" 
                    required
                    value={medFormData.name}
                    onChange={(e) => setMedFormData({...medFormData, name: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#004f6e]/20 focus:border-[#004f6e] outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">MRP (₹)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={medFormData.mrp}
                    onChange={(e) => setMedFormData({...medFormData, mrp: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#004f6e]/20 focus:border-[#004f6e] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">GST (%)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={medFormData.gst}
                    onChange={(e) => setMedFormData({...medFormData, gst: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#004f6e]/20 focus:border-[#004f6e] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Pack</label>
                  <input 
                    type="text" 
                    value={medFormData.pack}
                    onChange={(e) => setMedFormData({...medFormData, pack: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#004f6e]/20 focus:border-[#004f6e] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Batch</label>
                  <input 
                    type="text" 
                    value={medFormData.batch}
                    onChange={(e) => setMedFormData({...medFormData, batch: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#004f6e]/20 focus:border-[#004f6e] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Expiry</label>
                  <input 
                    type="text" 
                    placeholder="MM/YY"
                    value={medFormData.exp}
                    onChange={(e) => setMedFormData({...medFormData, exp: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#004f6e]/20 focus:border-[#004f6e] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Current Stock *</label>
                  <input 
                    type="number" 
                    min="0"
                    required
                    value={medFormData.stock}
                    onChange={(e) => setMedFormData({...medFormData, stock: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#004f6e]/20 focus:border-[#004f6e] outline-none font-bold text-lg"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setIsMedModalOpen(false)} className="px-5 py-2.5 font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-[#004f6e] hover:bg-[#00394f] text-white rounded-xl font-bold transition-colors">Save Medicine</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Purchases Modal */}
      {viewPurchasesModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-xl flex items-center gap-2">
                <FileText className="w-6 h-6 text-[#004f6e]" /> Purchase History
              </h3>
              <button onClick={() => { setViewPurchasesModal(false); setSelectedPurchase(null); }} className="text-slate-400 hover:text-slate-600"><X className="w-6 h-6" /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
              {purchases.length === 0 ? (
                <div className="text-center text-slate-500 py-8">No purchase history found.</div>
              ) : selectedPurchase ? (
                <div>
                  <button onClick={() => setSelectedPurchase(null)} className="mb-4 text-sm font-bold text-[#004f6e] hover:underline">&larr; Back to list</button>
                  <div className="bg-white border border-slate-200 rounded-xl p-6">
                    <div className="flex justify-between mb-6 pb-6 border-b border-slate-100">
                      <div>
                        <h4 className="font-bold text-lg text-slate-800">{selectedPurchase.vendor}</h4>
                        <p className="text-sm text-slate-500">Invoice No: {selectedPurchase.invoiceNo || 'N/A'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-500">Date: {new Date(selectedPurchase.invoiceDate).toLocaleDateString()}</p>
                        <p className="font-bold text-xl text-[#004f6e]">₹{selectedPurchase.summary?.grandTotal || '0.00'}</p>
                      </div>
                    </div>
                    <table className="w-full text-left text-xs whitespace-nowrap">
                      <thead className="bg-slate-50 text-slate-600">
                        <tr>
                          <th className="p-2">Qty</th>
                          <th className="p-2">Free</th>
                          <th className="p-2">Mfr</th>
                          <th className="p-2">Pack</th>
                          <th className="p-2">Product</th>
                          <th className="p-2">Batch</th>
                          <th className="p-2">Exp</th>
                          <th className="p-2">HSN</th>
                          <th className="p-2">M.R.P</th>
                          <th className="p-2">Rate</th>
                          <th className="p-2">Dis</th>
                          <th className="p-2">SGST %</th>
                          <th className="p-2">CGST %</th>
                          <th className="p-2 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {selectedPurchase.items.map((it, i) => (
                          <tr key={i}>
                            <td className="p-2 font-bold">{it.qty}</td>
                            <td className="p-2">{it.free || '-'}</td>
                            <td className="p-2">{it.mfr || '-'}</td>
                            <td className="p-2">{it.pack || '-'}</td>
                            <td className="p-2">{it.name}</td>
                            <td className="p-2 text-slate-500">{it.batch}</td>
                            <td className="p-2 text-slate-500">{it.exp}</td>
                            <td className="p-2 text-slate-500">{it.hsn || '-'}</td>
                            <td className="p-2">₹{it.mrp}</td>
                            <td className="p-2">₹{it.rate}</td>
                            <td className="p-2 text-slate-500">{it.dis ? `₹${it.dis}` : '-'}</td>
                            <td className="p-2 text-slate-500">{it.sgstPercent || '-'}</td>
                            <td className="p-2 text-slate-500">{it.cgstPercent || '-'}</td>
                            <td className="p-2 text-right font-semibold">₹{it.amount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="grid gap-4">
                  {purchases.slice().reverse().map((p, i) => (
                    <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between hover:shadow-md transition-shadow">
                      <div>
                        <h4 className="font-bold text-slate-800">{p.vendor}</h4>
                        <p className="text-sm text-slate-500">Inv: {p.invoiceNo || 'N/A'} • {new Date(p.invoiceDate).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-xs text-slate-400 font-bold uppercase tracking-wide mb-1">Grand Total</p>
                          <p className="font-bold text-lg text-[#004f6e]">₹{p.summary?.grandTotal || '0.00'}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {p.status === 'Paid' ? (
                            <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold border border-emerald-100">
                              Paid
                            </span>
                          ) : (
                            <button 
                              onClick={() => setPaymentModal(p)}
                              className="text-xs font-bold bg-orange-50 text-orange-600 px-3 py-1.5 rounded-full border border-orange-100 hover:bg-orange-100 transition-colors"
                            >
                              Mark Paid
                            </button>
                          )}
                          <button onClick={() => setSelectedPurchase(p)} className="p-2 text-slate-400 hover:text-[#004f6e] hover:bg-slate-100 rounded-full transition-colors">
                            <Eye className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Payment Confirmation Modal */}
      {paymentModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col p-6">
            <h3 className="font-bold text-slate-800 text-lg mb-2">Confirm Payment</h3>
            <p className="text-sm text-slate-500 mb-6">
              Are you sure you want to mark the invoice from <strong>{paymentModal.vendor}</strong> as paid?
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setPaymentModal(null)} 
                className="px-5 py-2 font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleMarkPaid} 
                className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold transition-colors"
              >
                Yes, Mark as Paid
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockManagement;
