import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { BarChart2, TrendingUp, IndianRupee, Pill, Calendar as CalendarIcon, Clock, FileText } from 'lucide-react';

const SalesReports = () => {
  const { doctor } = useContext(AuthContext);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState('daily'); // 'daily', 'weekly', 'monthly'

  useEffect(() => {
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
    fetchPatients();
  }, [doctor.token]);

  if (loading) {
    return <div className="p-8 text-slate-500 flex justify-center items-center h-full">Loading sales data...</div>;
  }

  // Extract all financial bills
  const allBills = patients.flatMap(p => p.financialBills || []);
  
  // Helper to get start of day, week, month
  const now = new Date();
  
  const getStartDate = (type) => {
    const date = new Date(now);
    if (type === 'daily') {
      date.setHours(0, 0, 0, 0);
    } else if (type === 'weekly') {
      const day = date.getDay();
      const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
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
  
  // Calculate Totals
  const totalRevenue = filteredBills.reduce((sum, bill) => sum + (bill.totalAmount || 0), 0);
  const totalBillsCount = filteredBills.length;
  
  // Aggregate Medicines
  const medicineSales = {};
  filteredBills.forEach(bill => {
    (bill.items || []).forEach(item => {
      const name = item.name.toLowerCase().trim();
      if (!medicineSales[name]) {
        medicineSales[name] = { name: item.name, quantity: 0, revenue: 0 };
      }
      // rough assumption: days * dosing frequency, but let's just count occurrences or total amount
      medicineSales[name].quantity += 1; // Assuming 1 row = 1 unit for simplicity, or we can parse days
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
    <div className="flex flex-col h-full">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <BarChart2 className="w-8 h-8 text-blue-600" /> Pharmacy Sales & Reports
          </h1>
          <p className="text-slate-500 mt-1">Track medicine sales, revenue, and generated bills.</p>
        </div>
        
        <div className="bg-white border border-slate-200 rounded-xl p-1 flex">
          <button 
            onClick={() => setReportType('daily')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${reportType === 'daily' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            Daily
          </button>
          <button 
            onClick={() => setReportType('weekly')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${reportType === 'weekly' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            Weekly
          </button>
          <button 
            onClick={() => setReportType('monthly')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${reportType === 'monthly' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            Monthly
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 p-6 rounded-2xl text-white shadow-lg shadow-emerald-600/20">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-white/20 p-3 rounded-xl">
              <IndianRupee className="w-6 h-6 text-white" />
            </div>
            <span className="bg-emerald-800/50 px-2.5 py-1 rounded-lg text-xs font-semibold backdrop-blur-sm">Revenue</span>
          </div>
          <h3 className="text-4xl font-bold mb-1">₹{totalRevenue.toFixed(2)}</h3>
          <p className="text-emerald-100 text-sm">Total earned {getPeriodString(reportType)}</p>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-blue-100 p-3 rounded-xl">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg text-xs font-semibold">Invoices</span>
          </div>
          <h3 className="text-4xl font-bold text-slate-800 mb-1">{totalBillsCount}</h3>
          <p className="text-slate-500 text-sm">Bills generated {getPeriodString(reportType)}</p>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-purple-100 p-3 rounded-xl">
              <Pill className="w-6 h-6 text-purple-600" />
            </div>
            <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg text-xs font-semibold">Medicines</span>
          </div>
          <h3 className="text-4xl font-bold text-slate-800 mb-1">{topMedicines.length}</h3>
          <p className="text-slate-500 text-sm">Unique medicines sold</p>
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
                const patient = patients.find(p => p.financialBills?.some(b => b._id === bill._id));
                return (
                  <div key={idx} className="border border-slate-100 rounded-xl p-4 bg-slate-50 hover:bg-white hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-bold text-slate-800">{patient ? patient.name : 'Unknown Patient'}</p>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5"><CalendarIcon className="w-3 h-3"/> {new Date(bill.date).toLocaleDateString('en-GB')} {new Date(bill.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-emerald-600">₹{bill.totalAmount?.toFixed(2)}</p>
                        <p className="text-[10px] text-slate-400">Items: {bill.items?.length || 0}</p>
                      </div>
                    </div>
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
