
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { User, mockDb } from '../lib/mockDb';
import { Upload, History, Share2, User as UserIcon, ShieldCheck, ShieldAlert, Copy, Check } from 'lucide-react';
import { cn } from '../lib/utils';

interface PatientDashboardProps {
  user: User;
  onUpdate: () => void;
}

export default function PatientDashboard({ user, onUpdate }: PatientDashboardProps) {
  const [copied, setCopied] = useState(false);

  const toggleSharing = () => {
    mockDb.updateUserSharing(user.id, !user.sharingEnabled);
    onUpdate();
  };

  const copyId = () => {
    navigator.clipboard.writeText(user.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8 space-y-6 pb-24">
      {/* Profile Card */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-start gap-4">
        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
          <UserIcon className="w-8 h-8" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
          <div className="flex flex-wrap gap-2 mt-1">
            <span className="text-xs font-semibold px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">{user.age} Years</span>
            <span className="text-xs font-semibold px-2 py-0.5 bg-red-50 text-red-600 rounded-full">{user.bloodGroup}</span>
          </div>
          <p className="text-xs text-gray-400 mt-2 font-mono flex items-center gap-2">
            ID: {user.id}
            <button onClick={copyId} className="hover:text-blue-600 transition-colors">
              {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
            </button>
          </p>
        </div>
      </div>

      {/* Action Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Link 
          to="/patient/upload"
          className="bg-blue-600 p-6 rounded-3xl text-white shadow-lg shadow-blue-100 hover:scale-[1.02] transition-transform active:scale-95 flex flex-col gap-3"
        >
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold">Upload</div>
            <div className="text-[10px] text-blue-100 font-medium">Add New Record</div>
          </div>
        </Link>
        <Link 
          to="/patient/timeline"
          className="bg-white p-6 rounded-3xl text-gray-900 shadow-sm border border-gray-100 hover:scale-[1.02] transition-transform active:scale-95 flex flex-col gap-3"
        >
          <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
            <History className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold">Timeline</div>
            <div className="text-[10px] text-gray-400 font-medium">History</div>
          </div>
        </Link>
      </div>

      {/* QR Code Section */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center gap-6">
        <div className="text-center">
          <h3 className="font-bold text-gray-900">Patient QR Code</h3>
          <p className="text-xs text-gray-400 font-medium mt-1">Show this to your doctor to grant access</p>
        </div>
        
        <div className={cn(
          "p-4 bg-white rounded-3xl shadow-inner border border-gray-100 relative transition-all duration-500",
          !user.sharingEnabled && "grayscale blur-[2px] opacity-20 scale-90"
        )}>
          <QRCodeSVG 
            value={`${window.location.origin}/doctor/patient/${user.id}`}
            size={180}
            level="H"
            includeMargin={true}
          />
          {!user.sharingEnabled && (
            <div className="absolute inset-0 flex items-center justify-center">
              <ShieldAlert className="w-12 h-12 text-gray-400 rotate-12" />
            </div>
          )}
        </div>

        <button 
          onClick={toggleSharing}
          className={cn(
            "w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-bold transition-all active:scale-[0.98]",
            user.sharingEnabled 
              ? "bg-green-50 text-green-700 border border-green-100" 
              : "bg-red-50 text-red-600 border border-red-100"
          )}
        >
          {user.sharingEnabled ? <ShieldCheck className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
          Sharing: {user.sharingEnabled ? 'ON' : 'OFF'}
        </button>
      </div>

      <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
        <div className="flex gap-3">
          <Share2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
          <p className="text-[11px] text-blue-700/80 leading-relaxed font-medium">
            When sharing is ON, doctors can view your medical history by scanning your QR code or using your Patient ID.
          </p>
        </div>
      </div>
    </div>
  );
}
