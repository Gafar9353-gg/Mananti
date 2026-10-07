import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { BarChart2, TrendingUp, IndianRupee, Pill, Calendar as CalendarIcon, Clock, FileText, Stethoscope, UserCheck } from 'lucide-react';

const SalesReports = () => {
  const { doctor } = useContext(AuthContext);
  const [patients, setPatients] = useState(() => {
    try {
      const cached = localStorage.getItem('mananti_patients');
      return cached ? JSON.parse(cached) : [];
    } catch (e) {
      return [];
    }
  });
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState('daily'); // 'daily', 'weekly', 'monthly'

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${doctor?.token || ''}` } };
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5005'}/api/patients`, config);
        if (Array.isArray(data) && data.length > 0) {
          setPatients(data);
          localStorage.setItem('mananti_patients', JSON.stringify(data));
        } else {
          const cached = localStorage.getItem('mananti_patients');
          if (cached) setPatients(JSON.parse(cached));
        }
      } catch (error) {
        console.warn('Backend unavailable, loading patients from cache:', error);
        const cached = localStorage.getItem('mananti_patients');
        if (cached) {
          try { setPatients(JSON.parse(cached)); } catch (e) {}
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, [doctor?.token]);

  if (loading) {
    return <div className="p-8 text-slate-500 flex justify-center items-center h-full">Loading sales data...</div>;
  }

  // Extract all financial bills from loaded patients and locally stored patient records
  const localBills = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('mananti_patient_') || key.startsWith('patient_'))) {
        try {
          const pData = JSON.parse(localStorage.getItem(key) || '{}');
          if (pData && Array.isArray(pData.financialBills)) {
            localBills.push(...pData.financialBills);
          }
        } catch (e) {}
      }
    }
  } catch (e) {}

  const combinedBills = [...patients.flatMap(p => p.financialBills || []), ...localBills];
  // Deduplicate bills by _id or billNo
  const billMap = new Map();
  combinedBills.forEach(b => {
    if (b) {
      const idKey = b._id || b.billNo || JSON.stringify(b);
      billMap.set(idKey, b);
    }
  });
  const allBills = Array.from(billMap.values());
  
  // Helper to get start of day, week, month
  const now = new Date();
  
  const getStartDate = (type) => {
    const date = new Date(now);
    if (type === 'daily') {
      date.setHours(0, 0, 0, 0);
    } else if (type === 'weekly') {
      const day = date.getDay();
      const diff = date.getDate() - day + (day === 0 ? -6 : 1);
      date.setDate(diff);
      date.setHours(0, 0, 0, 0);
    } else if (type === 'monthly') {
      date.setDate(1);
      date.setHours(0, 0, 0, 0);
    }
    return date;
  };

  const startDate = getStartDate(reportType);

  // Filter bills
  const filteredBills = allBills.filter(bill => new Date(bill.date) >= startDate);
  
  // Calculate Totals including Doctor Consultation Fees
  const totalRevenue = filteredBills.reduce((sum, bill) => sum + (parseFloat(bill.totalAmount) || 0), 0);
  const totalConsultationFees = filteredBills.reduce((sum, bill) => sum + (parseFloat(bill.consultationCharges) || 0), 0);
  const totalMedicineSales = filteredBills.reduce((sum, bill) => {
    const medPart = (parseFloat(bill.totalAmount) || 0) - (parseFloat(bill.consultationCharges) || 0);
    return sum + (medPart > 0 ? medPart : 0);
  }, 0);
  const totalBillsCount = filteredBills.length;
  
  // Aggregate Medicines
  const medicineSales = {};
  filteredBills.forEach(bill => {
    (bill.items || []).forEach(item => {
      const name = item.name.toLowerCase().trim();
      if (!medicineSales[name]) {
        medicineSales[name] = { name: item.name, quantity: 0, revenue: 0 };
      }
      medicineSales[name].quantity += 1;
      medicineSales[name].revenue += parseFloat(item.amount || 0);
    });
  });
  
  const topMedicines = Object.values(medicineSales).sort((a, b) => b.revenue - a.revenue);

  const getPeriodString = (type) => {
    if (type === 'daily') return 'today';
    if (type === 'weekly') return 'this week';
    if (type === 'monthly') return 'this month';
    return '';
  };

  return (
    <div className="flex flex-col h-full w-full max-w-full min-w-0">
      <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 flex items-center gap-2 sm:gap-3">
            <BarChart2 className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" /> Pharmacy Sales & Reports
          </h1>
          <p className="text-slate-500 mt-1 text-xs sm:text-sm">Track medicine sales, revenue, and generated bills.</p>
        </div>
        
        <div className="bg-white border border-slate-200 rounded-xl p-1 flex w-full sm:w-auto justify-between sm:justify-start">
          <button 
            onClick={() => setReportType('daily')}
            className={`flex-1 sm:flex-initial px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${reportType === 'daily' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            Daily
          </button>
          <button 
            onClick={() => setReportType('weekly')}
            className={`flex-1 sm:flex-initial px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${reportType === 'weekly' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            Weekly
          </button>
          <button 
            onClick={() => setReportType('monthly')}
            className={`flex-1 sm:flex-initial px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${reportType === 'monthly' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            Monthly
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {/* Total Revenue */}
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 p-6 rounded-2xl text-white shadow-lg shadow-emerald-600/20">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-white/20 p-3 rounded-xl">
              <IndianRupee className="w-6 h-6 text-white" />
            </div>
            <span className="bg-emerald-800/50 px-2.5 py-1 rounded-lg text-xs font-semibold backdrop-blur-sm">Total Revenue</span>
          </div>
          <h3 className="text-3xl sm:text-4xl font-bold mb-1">₹{totalRevenue.toFixed(2)}</h3>
          <p className="text-emerald-100 text-xs sm:text-sm">Total earned {getPeriodString(reportType)}</p>
          <div className="mt-3 pt-2 border-t border-emerald-400/40 text-[11px] text-emerald-100 flex justify-between">
            <span>Meds: ₹{totalMedicineSales.toFixed(2)}</span>
            <span>Consult: ₹{totalConsultationFees.toFixed(2)}</span>
          </div>
        </div>

        {/* Doctor Consultation Fees */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-teal-50 text-[#004f6e] p-3 rounded-xl border border-teal-100">
              <Stethoscope className="w-6 h-6 text-[#004f6e]" />
            </div>
            <span className="bg-teal-50 text-teal-700 border border-teal-200 px-2.5 py-1 rounded-lg text-xs font-bold">Doctor Fees</span>
          </div>
          <h3 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-1">₹{totalConsultationFees.toFixed(2)}</h3>
          <p className="text-slate-500 text-xs sm:text-sm">Consultation fees {getPeriodString(reportType)}</p>
          <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-teal-700 font-semibold flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5 text-teal-600" /> Entered by doctor in bills
          </div>
        </div>

        {/* Invoices */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-blue-100 p-3 rounded-xl">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg text-xs font-semibold">Invoices</span>
          </div>
          <h3 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-1">{totalBillsCount}</h3>
          <p className="text-slate-500 text-xs sm:text-sm">Bills generated {getPeriodString(reportType)}</p>
          <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-400">
            Total receipts issued
          </div>
        </div>

        {/* Unique Medicines */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-purple-100 p-3 rounded-xl">
              <Pill className="w-6 h-6 text-purple-600" />
            </div>
            <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg text-xs font-semibold">Medicines</span>
          </div>
          <h3 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-1">{topMedicines.length}</h3>
          <p className="text-slate-500 text-xs sm:text-sm">Unique medicines sold</p>
          <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-400">
            Pharmacy dispensary
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
        
        {/* Medicine Sales Breakdown */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="font-bold text-lg text-slate-800 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-orange-500" /> Top Selling Medicines
            </h2>
          </div>
          <div className="overflow-y-auto flex-1 p-0">
            {topMedicines.length === 0 ? (
              <p className="p-8 text-center text-slate-500">No medicine sales recorded for this period.</p>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 sticky top-0">
                  <tr>
                    <th className="px-6 py-3 font-medium">Medicine Name</th>
                    <th className="px-6 py-3 font-medium text-center">Times Prescribed</th>
                    <th className="px-6 py-3 font-medium text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {topMedicines.map((med, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-semibold text-slate-700">{med.name}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded font-medium">{med.quantity}</span>
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-emerald-600">₹{med.revenue.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Recent Bills */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="font-bold text-lg text-slate-800 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" /> Recent Invoices ({reportType})
            </h2>
          </div>
          <div className="overflow-y-auto flex-1 p-4 space-y-3">
            {filteredBills.length === 0 ? (
              <p className="p-4 text-center text-slate-500">No bills generated in this period.</p>
            ) : (
              [...filteredBills].reverse().map((bill, idx) => {
                const patient = patients.find(p => p.financialBills?.some(b => b._id === bill._id)) ||
                  patients.find(p => p._id === bill.patientId);
                const hasConsult = parseFloat(bill.consultationCharges) > 0;
                return (
                  <div key={idx} className="border border-slate-100 rounded-xl p-4 bg-slate-50 hover:bg-white hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-bold text-slate-800 text-sm sm:text-base">{patient ? patient.name : (bill.patientName || 'Patient Bill')}</p>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <CalendarIcon className="w-3 h-3"/> {new Date(bill.date).toLocaleDateString('en-GB')} {new Date(bill.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          {bill.billNo && <span className="ml-1 text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">{bill.billNo}</span>}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-emerald-600">₹{bill.totalAmount?.toFixed(2)}</p>
                        <p className="text-[10px] text-slate-400">Items: {bill.items?.length || 0}</p>
                      </div>
                    </div>

                    {/* Consultation Fee Breakdown */}
                    {hasConsult && (
                      <div className="mt-2 mb-2 flex items-center justify-between text-xs bg-teal-50 border border-teal-100 px-3 py-1.5 rounded-lg text-teal-800">
                        <span className="font-semibold flex items-center gap-1.5">
                          <Stethoscope className="w-3.5 h-3.5 text-[#004f6e]" /> Doctor Consultation Fee:
                        </span>
                        <span className="font-bold text-sm text-[#004f6e]">₹{parseFloat(bill.consultationCharges).toFixed(2)}</span>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-1 mt-2">
                      {bill.items?.slice(0, 3).map((item, i) => (
                        <span key={i} className="text-[10px] bg-white border border-slate-200 px-2 py-1 rounded text-slate-600">{item.name}</span>
                      ))}
                      {bill.items?.length > 3 && (
                        <span className="text-[10px] bg-slate-200 px-2 py-1 rounded text-slate-600">+{bill.items.length - 3} more</span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesReports;
