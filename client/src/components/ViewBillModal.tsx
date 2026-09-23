import React from 'react';
import { Printer } from 'lucide-react';

const ViewBillModal = ({ bill, patient, doctor, onClose }) => {
  const items = bill.items || [];
  const totalAmount = bill.totalAmount || 0;

  const handlePrint = () => {
    window.print();
  };

  const calculateQtyFallback = (dosing, days) => {
    if (!dosing || !days) return 1;
    const parts = String(dosing).split('-');
    const perDay = parts.reduce((sum, p) => sum + (parseFloat(p) || 0), 0);
    const d = parseFloat(days) || 0;
    return (perDay * d) || 1;
  };

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
                <tr><td className="py-0.5 w-16 text-slate-700">Bill No.</td><td className="py-0.5 font-semibold text-black">: {bill.billNo || `B-${bill._id.slice(-6)}`}</td></tr>
                <tr><td className="py-0.5 text-slate-700">Date</td><td className="py-0.5 font-semibold text-black">: {new Date(bill.date).toLocaleDateString('en-GB')}</td></tr>
                <tr><td className="py-0.5 text-slate-700">Time</td><td className="py-0.5 font-semibold text-black">: {new Date(bill.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td></tr>
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
                <th className="p-1.5 border-r border-slate-800 font-bold text-center">Medicine</th>
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
                  <td className="p-1.5 border-r border-slate-300 text-center font-bold text-black">{item.quantity || calculateQtyFallback(item.dosing, item.days)}</td>
                  <td className="p-1.5 border-r border-slate-300 text-center text-black">{item.batchNo}</td>
                  <td className="p-1.5 border-r border-slate-300 text-center text-black break-all">{item.expDate}</td>
                  <td className="p-1.5 text-right font-semibold text-black">{parseFloat(item.amount || 0).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Totals Section */}
          <div className="flex justify-end border-t-2 border-slate-800">
            <div className="w-48 print:w-40 border-l-2 border-slate-800">
              <div className="flex justify-between p-1.5 border-b border-slate-300 text-xs print:text-[10px] text-black">
                <span>Subtotal</span>
                <span>₹ {parseFloat(bill.subtotal || totalAmount).toFixed(2)}</span>
              </div>
              {(parseFloat(bill.consultationCharges) > 0) && (
              <div className="flex justify-between p-1.5 border-b border-slate-300 text-xs print:text-[10px] text-black">
                <span>Consultation Fees</span>
                <span>₹ {parseFloat(bill.consultationCharges).toFixed(2)}</span>
              </div>
              )}
              <div className="flex justify-between p-1.5 bg-slate-100 font-bold text-black text-sm print:text-xs">
                <span>Total</span>
                <span>₹ {parseFloat(bill.totalAmount || totalAmount).toFixed(2)}</span>
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
        <button onClick={onClose} className="px-6 py-2 bg-slate-800 text-white shadow-lg rounded-lg font-bold">Close</button>
        <button onClick={handlePrint} className="px-6 py-2 bg-[#1e5b87] shadow-lg text-white rounded-lg font-bold flex items-center gap-2">
          <Printer className="w-5 h-5" /> Print Bill
        </button>
      </div>
    </div>
  );
};

export default ViewBillModal;
