
import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, mockDb } from '../lib/mockDb';
import { Search, QrCode, ArrowRight, ShieldCheck, Stethoscope, Users, UserPlus } from 'lucide-react';
import { cn } from '../lib/utils';

interface DoctorDashboardProps {
  user: User;
}

export default function DoctorDashboard({ user }: DoctorDashboardProps) {
  const navigate = useNavigate();
  const [patientId, setPatientId] = useState('');
  const [error, setError] = useState('');

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (!patientId.trim()) return;
    
    const targetPatient = mockDb.getUserById(patientId.trim());
    if (targetPatient && targetPatient.role === 'patient') {
      navigate(`/doctor/patient/${targetPatient.id}`);
    } else {
      setError('Patient record not found');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8 space-y-8">
      {/* Welcome Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-900 text-white rounded-2xl flex items-center justify-center">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 leading-none">Dr. {user.name}</h1>
            <p className="text-sm text-gray-400 font-medium mt-1">{user.degree}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2">
            <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <div className="font-bold text-gray-900 text-xl">Digital</div>
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Health Access</div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2">
            <div className="w-8 h-8 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="font-bold text-gray-900 text-xl">Secure</div>
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Verified Records</div>
          </div>
        </div>
      </div>

      {/* Main Search Section */}
      <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 space-y-8">
        <div className="text-center space-y-1">
          <h2 className="text-xl font-extrabold text-gray-900">Access Patient Records</h2>
          <p className="text-xs text-gray-400 font-medium">Scan QR or enter Patient ID manually</p>
        </div>

        <form onSubmit={handleSearch} className="space-y-4">
          <div className="relative group">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="e.g. kj82ns01"
              value={patientId}
              onChange={(e) => {
                setPatientId(e.target.value);
                setError('');
              }}
              className="w-full pl-14 pr-5 py-5 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-blue-500 rounded-3xl text-sm font-bold tracking-wider outline-none transition-all placeholder:text-gray-300"
            />
          </div>

          {error && (
            <p className="text-xs font-bold text-red-500 text-center px-4 animate-shake">{error}</p>
          )}

          <button
            type="submit"
            className="w-full py-5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white rounded-3xl font-bold flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-100 uppercase tracking-widest text-sm"
          >
            View Patient Profile
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-100 italic font-mono text-[10px] text-gray-200 text-center">
              OR SCAN QR CODE
            </div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-4 text-[10px] font-bold text-gray-300 tracking-widest uppercase">Method B</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => alert('Demo: Use QR scanners in real-world apps. For this demo, please enter the Patient ID manually.')}
          className="w-full py-5 border-2 border-gray-100 hover:border-gray-900 hover:bg-gray-50 rounded-3xl font-bold flex items-center justify-center gap-3 transition-all text-gray-900 uppercase tracking-widest text-sm active:scale-95"
        >
          <QrCode className="w-5 h-5" />
          Launch Camera Scanner
        </button>
      </div>

      <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
        <div className="flex gap-3">
          <UserPlus className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
          <p className="text-[11px] text-gray-400 leading-relaxed font-medium">
            You can only access a patient's data if they have enabled "Privacy Sharing" and provided their unique Patient ID.
          </p>
        </div>
      </div>
    </div>
  );
}
