
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockDb, User, MedicalRecord } from '../lib/mockDb';
import { History, FileText, ChevronLeft, Eye, Calendar, Tag } from 'lucide-react';
import { cn } from '../lib/utils';

interface TimelineProps {
  user: User;
}

export default function Timeline({ user }: TimelineProps) {
  const navigate = useNavigate();
  const [records, setRecords] = useState<MedicalRecord[]>([]);

  useEffect(() => {
    setRecords(mockDb.getRecordsByPatientId(user.id));
  }, [user.id]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8 space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 font-bold text-sm hover:text-gray-900 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>
        <div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest leading-none">
          {records.length} Records
        </div>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
          Medical History
        </h1>
        <p className="text-sm text-gray-400 font-medium italic">Your health journey, recorded.</p>
      </div>

      {records.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-dashed border-gray-200 text-center space-y-4">
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 mx-auto">
            <History className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-gray-900">No records yet</h3>
            <p className="text-xs text-gray-400 font-medium">Your medical history will appear here once you upload records.</p>
          </div>
          <button 
            onClick={() => navigate('/patient/upload')}
            className="text-sm font-bold text-blue-600 hover:underline"
          >
            Upload your first record
          </button>
        </div>
      ) : (
        <div className="space-y-4 relative before:absolute before:left-[23px] before:top-4 before:bottom-4 before:w-px before:bg-gray-200">
          {records.map((record) => (
            <div 
              key={record.id}
              className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex gap-4 hover:shadow-md transition-all active:scale-[0.99] group relative z-10"
            >
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-all",
                record.type === 'prescription' ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"
              )}>
                <FileText className="w-6 h-6" />
              </div>
              
              <div className="flex-1 space-y-1 overflow-hidden">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-900 truncate pr-2 group-hover:text-blue-600 transition-colors">
                    {record.fileName}
                  </h3>
                  <div className={cn(
                    "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    record.type === 'prescription' ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
                  )}>
                    {record.type}
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-[11px] text-gray-400 font-medium">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(record.createdAt)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    ID: {record.id}
                  </span>
                </div>

                <div className="pt-2">
                  <a 
                    href={record.fileURL} 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-950 text-white text-[10px] font-bold rounded-xl hover:bg-gray-800 transition-colors tracking-widest uppercase"
                  >
                    <Eye className="w-3 h-3" />
                    View File
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
