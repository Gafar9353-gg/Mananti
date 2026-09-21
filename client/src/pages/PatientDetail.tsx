import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { SocketContext } from '../context/SocketContext';
import { AuthContext } from '../context/AuthContext';
import { ArrowLeft, Edit, FileText, Clock, FileImage, FileUp, ClipboardList, PlusCircle } from 'lucide-react';
import PatientForm from '../components/PatientForm';
import ReportUploadForm from '../components/ReportUploadForm';
import PrescriptionForm from '../components/PrescriptionForm';
import BillingForm from '../components/BillingForm';
import ViewBillModal from '../components/ViewBillModal';

const PatientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { doctor } = useContext(AuthContext);
  const socket = useContext(SocketContext);
  
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showPrescription, setShowPrescription] = useState(false);
  const [showBilling, setShowBilling] = useState(false);
  const [viewingBill, setViewingBill] = useState(null);
  const [pendingBillingData, setPendingBillingData] = useState(null);

  const fetchPatient = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${doctor.token}` } };
      const { data } = await axios.get(`http://localhost:5005/api/patients/${id}`, config);
      setPatient(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatient();
  }, [id]);

  useEffect(() => {
    if (socket) {
      socket.on('patient_updated', (updatedPatient) => {
        if (updatedPatient._id === id) {
          setPatient(updatedPatient);
        }
      });
    }
    return () => {
      if (socket) socket.off('patient_updated');
    };
  }, [socket, id]);

  if (loading) return <div className="p-8 text-center text-slate-500">Loading patient details...</div>;
  if (!patient) return <div className="p-8 text-center text-slate-500">Patient not found.</div>;

  return (
    <div className="py-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 font-medium transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Directory
      </button>

      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            {patient.name}
            <span className="text-sm px-3 py-1 bg-blue-100 text-[#004f6e] rounded-full font-semibold">
              {patient.pid} • {patient.age} yrs • {patient.gender}
            </span>
          </h1>
          <p className="text-slate-500 mt-1">Doctor Assigned: {patient.doctorName || '-'}</p>
        </div>
        <div className="flex gap-3">
          {doctor?.role === 'doctor' && (
            <>
              <button onClick={() => setShowPrescription(true)} className="bg-purple-600 text-white hover:bg-purple-700 px-4 py-2 rounded-xl font-medium flex items-center gap-2 shadow-sm">
                <PlusCircle className="h-4 w-4" /> Write Prescription
              </button>
              <button onClick={() => setShowEdit(true)} className="bg-[#004f6e] text-white hover:bg-[#00394f] px-4 py-2 rounded-xl font-medium flex items-center gap-2 shadow-sm">
                <Edit className="h-4 w-4" /> Edit Details
              </button>
            </>
          )}
          {doctor?.role === 'staff' && (
            <>
              <button onClick={() => setShowUpload(true)} className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-xl font-medium flex items-center gap-2 shadow-sm">
                <FileUp className="h-4 w-4" /> Upload Report
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Current Info */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold text-slate-800 border-b pb-4 mb-4">Current Record</h2>
            <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
              <div><span className="text-slate-500 block">Contact</span><span className="font-medium text-slate-800">{patient.contact}</span></div>
              <div><span className="text-slate-500 block">Care of (C/o)</span><span className="font-medium text-slate-800">{patient.careOf || '-'}</span></div>
              <div><span className="text-slate-500 block">Date of Visit</span><span className="font-medium text-slate-800">{patient.dateOfVisit ? new Date(patient.dateOfVisit).toLocaleDateString('en-GB') : 'N/A'}</span></div>
              <div><span className="text-slate-500 block">Location</span><span className="font-medium text-slate-800">{patient.location || '-'}</span></div>
              <div className="col-span-2"><span className="text-slate-500 block">Disease / Complaint</span><span className="font-medium text-slate-800">{patient.disease || '-'}</span></div>
              <div className="col-span-2 bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                <span className="text-emerald-600 block mb-1">Doctor's Remarks</span>
                <span className="text-emerald-900">{patient.remarks || 'No remarks.'}</span>
              </div>
            </div>
          </div>

          {/* Prescriptions History */}
          {doctor?.role === 'doctor' && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><ClipboardList className="h-5 w-5 text-purple-600" /> Prescriptions & Visits</h2>
            {(!patient.prescriptions || patient.prescriptions.length === 0) ? (
              <p className="text-sm text-slate-500 text-center py-6 bg-slate-50 rounded-xl">No prescriptions recorded yet.</p>
            ) : (
              <div className="space-y-4">
                {[...patient.prescriptions].reverse().map(rx => (
                  <div key={rx._id} className="border border-slate-100 rounded-xl overflow-hidden shadow-sm">
                    <div className="bg-purple-50 p-3 flex justify-between items-center border-b border-slate-100">
                      <div>
                        <span className="font-bold text-purple-900 text-sm">{new Date(rx.date).toLocaleDateString('en-GB')}</span>
                        <span className="text-xs text-purple-600 ml-2 bg-purple-200 px-2 rounded-full">{rx.disease}</span>
                      </div>
                      <span className="text-xs text-slate-500">Dr. {rx.doctorName || 'Doctor'}</span>
                    </div>
                    <div className="p-3 bg-white">
                      <table className="w-full text-sm text-left">
                        <thead>
                          <tr className="text-slate-500 border-b border-slate-50">
                            <th className="pb-2">Medicine</th>
                            <th className="pb-2">Dosing</th>
                            <th className="pb-2">Days</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rx.medicines.map((m, i) => (
                            <tr key={i}>
                              <td className="py-2 font-medium text-slate-700">{m.name}</td>
                              <td className="py-2 text-slate-600">{m.dosing}</td>
                              <td className="py-2 text-slate-600">{m.days}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {rx.nextVisit && <p className="text-xs text-slate-500 mt-2 pt-2 border-t border-slate-50">Next Visit Recommended: <span className="font-semibold text-slate-700">{new Date(rx.nextVisit).toLocaleDateString('en-GB')}</span></p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          )}

          {/* Documents Gallery */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><FileText className="h-5 w-5 text-blue-600" /> Patient Reports</h2>
            {patient.bills && patient.bills.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-6 bg-slate-50 rounded-xl">No reports uploaded yet.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {patient.bills && patient.bills.map(report => (
                  <a key={report._id} href={`http://localhost:5005${report.filePath}`} target="_blank" rel="noopener noreferrer" className="block group">
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col items-center justify-center text-center hover:bg-blue-50 hover:border-blue-200 transition-colors aspect-square">
                      <FileImage className="h-8 w-8 text-slate-400 group-hover:text-blue-600 mb-2 transition-colors" />
                      <span className="text-xs font-semibold text-slate-700 line-clamp-1 w-full">{report.originalName}</span>
                      <span className="text-[10px] text-slate-500 mt-1 px-2 py-0.5 bg-slate-200 rounded-md">{report.billType}</span>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Version History Sidebar */}
        <div className="space-y-6">
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4"><FileText className="h-5 w-5 text-orange-500" /> Financial Bills</h2>
            {(!patient.financialBills || patient.financialBills.length === 0) ? (
              <p className="text-sm text-slate-500">No bills generated.</p>
            ) : (
              <div className="space-y-3">
                {[...patient.financialBills].reverse().map(bill => (
                  <div key={bill._id} onClick={() => setViewingBill(bill)} className="bg-orange-50 border border-orange-100 rounded-xl p-3 text-sm flex justify-between items-center cursor-pointer hover:bg-orange-100 transition-colors">
                    <div>
                      <p className="font-bold text-slate-800">{bill.billNo || `B-${bill._id.slice(-6)}`} <span className="text-slate-400 font-normal text-xs ml-2">{new Date(bill.date).toLocaleDateString('en-GB')}</span></p>
                      <p className="text-xs text-slate-500">Total: ₹{bill.totalAmount}</p>
                    </div>
                    <div className="bg-white rounded-full p-2 shadow-sm text-orange-600">
                      <FileText className="w-4 h-4" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>


        </div>
      </div>

      {showEdit && <PatientForm initialData={patient} onClose={() => setShowEdit(false)} />}
      {showUpload && <ReportUploadForm patientId={patient._id} onClose={() => setShowUpload(false)} />}
      {showPrescription && (
        <PrescriptionForm 
          patientId={patient._id} 
          initialDisease={patient.disease} 
          onClose={() => setShowPrescription(false)} 
          onPrescriptionSaved={(prescriptionData) => {
            setShowPrescription(false);
            setPendingBillingData(prescriptionData);
            setShowBilling(true);
          }}
        />
      )}
      {showBilling && (
        <BillingForm 
          patient={patient} 
          initialPrescription={pendingBillingData}
          onClose={() => {
            setShowBilling(false);
            setPendingBillingData(null);
          }} 
        />
      )}
      {viewingBill && <ViewBillModal bill={viewingBill} patient={patient} doctor={doctor} onClose={() => setViewingBill(null)} />}
    </div>
  );
};

export default PatientDetail;
