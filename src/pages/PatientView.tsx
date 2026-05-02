
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockDb, User, MedicalRecord } from '../lib/mockDb';
import { ChevronLeft, ShieldAlert, User as UserIcon, FileText, Calendar, Eye, Activity, MapPin, Droplet } from 'lucide-react';
import { cn } from '../lib/utils';

export default function PatientView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<User | null>(null);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const data = mockDb.getUserById(id);
      if (data && data.role === 'patient') {
        setPatient(data);
        if (data.sharingEnabled) {
          setRecords(mockDb.getRecordsByPatientId(id));
        }
      }
    }
    setLoading(false);
  }, [id]);

  if (loading) {
    return <div className="p-8 text-center animate-pulse">Fetching patient data...</div>;
  }

  if (!patient) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 text-center space-y-4">
        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold">Patient Not Found</h2>
        <button onClick={() => navigate('/doctor/dashboard')} className="text-blue-600 font-bold underline">Go Back</button>
      </div>
    );
  }

  // PRIVACY CONTROL CHECK
  if (!patient.sharingEnabled) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 text-center space-y-6">
        <div className="w-24 h-24 bg-red-100/50 text-red-600 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-red-100 animate-bounce">
          <ShieldAlert className="w-12 h-12" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Access Denied</h2>
          <p className="text-sm text-gray-500 font-medium leading-relaxed italic border-t border-red-100 pt-4 px-4">
            The patient "{patient.name}" has disabled data sharing. 
            <br />
            Please ask them to toggle "Sharing: ON" in their dashboard.
          </p>
        </div>
        <button 
          onClick={() => navigate('/doctor/dashboard')}
          className="w-full py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-black transition-all"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-8 space-y-6 pb-24">
      <button 
        onClick={() => navigate('/doctor/dashboard')}
        className="flex items-center gap-2 text-gray-500 font-bold text-sm hover:text-gray-900 transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
        Back to Search
      </button>

      {/* Patient Profile Header */}
      <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-blue-600 text-white rounded-3xl flex items-center justify-center">
            <UserIcon className="w-10 h-10" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">{patient.name}</h1>
            <p className="text-xs text-blue-600 font-mono tracking-widest uppercase mt-1">Patient ID: {patient.id}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gray-50 p-3 rounded-2xl text-center space-y-1">
            <Activity className="w-4 h-4 text-blue-500 mx-auto" />
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Age</div>
            <div className="text-sm font-bold text-gray-900">{patient.age}</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-2xl text-center space-y-1">
            <Droplet className="w-4 h-4 text-red-500 mx-auto" />
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Blood</div>
            <div className="text-sm font-bold text-gray-900">{patient.bloodGroup}</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-2xl text-center space-y-1">
            <MapPin className="w-4 h-4 text-green-500 mx-auto" />
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Gen</div>
            <div className="text-sm font-bold text-gray-900">{patient.gender}</div>
          </div>
        </div>

        <div className="p-4 bg-blue-50/30 rounded-2xl border border-blue-50">
          <label className="text-[10px] font-bold text-blue-300 uppercase tracking-[0.2em] block mb-1">Residential Address</label>
          <p className="text-xs text-gray-700 font-medium leading-relaxed italic">{patient.address}</p>
        </div>
      </div>

      {/* Records Timeline */}
      <div className="space-y-4">
        <h3 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
          Clinical Records
          <span className="text-xs font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-lg">{records.length}</span>
        </h3>

        {records.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-dashed border-gray-200 text-center">
            <p className="text-sm text-gray-400 italic">No medical history available for this patient.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {records.map((record) => (
              <div 
                key={record.id}
                className="bg-white p-4 rounded-3xl border border-gray-100 flex items-center justify-between group hover:border-blue-200 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center",
                    record.type === 'prescription' ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"
                  )}>
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{record.fileName}</div>
                    <div className="text-[10px] text-gray-400 font-medium flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      {new Date(record.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <a 
                  href={record.fileURL} 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-10 h-10 bg-gray-950 text-white rounded-xl flex items-center justify-center hover:bg-blue-600 transition-all shadow-lg shadow-gray-100"
                >
                  <Eye className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
