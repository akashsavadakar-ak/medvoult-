
import { useState, useRef, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockDb, User } from '../lib/mockDb';
import { Upload, FileText, CheckCircle2, AlertCircle, X, ChevronLeft } from 'lucide-react';
import { cn } from '../lib/utils';

interface UploadRecordProps {
  user: User;
}

export default function UploadRecord({ user }: UploadRecordProps) {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [file, setFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<'prescription' | 'report'>('prescription');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 2 * 1024 * 1024) { // 2MB limit for local storage
        setError('File too large for demo (Max 2MB)');
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  const handleUpload = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    try {
      // Convert to Data URL for local storage demo
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        mockDb.addRecord({
          patientId: user.id,
          fileURL: dataUrl,
          fileName: file.name,
          type: fileType,
        });
        setLoading(false);
        setSuccess(true);
        setTimeout(() => navigate('/patient/timeline'), 1500);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError('Failed to upload file');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8 space-y-6">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 font-bold text-sm hover:text-gray-900 transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
        Back
      </button>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Upload Record</h1>
          <p className="text-sm text-gray-400 font-medium mt-1">Prescriptions or medical reports</p>
        </div>

        <form onSubmit={handleUpload} className="space-y-6">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all flex flex-col items-center gap-4",
              file ? "border-green-200 bg-green-50" : "border-gray-200 hover:border-blue-400 hover:bg-blue-50"
            )}
          >
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden" 
              accept="image/*,application/pdf"
            />
            {file ? (
              <>
                <div className="w-16 h-16 bg-green-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-green-100">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="text-sm font-bold text-green-700 truncate max-w-full italic">{file.name}</div>
                <button 
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setFile(null); }}
                  className="text-xs font-bold text-red-500 hover:underline"
                >
                  Remove
                </button>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-2xl flex items-center justify-center">
                  <Upload className="w-8 h-8" />
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900">Click to upload</div>
                  <div className="text-xs text-gray-400 mt-1">PNG, JPG, PDF up to 2MB</div>
                </div>
              </>
            )}
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider px-1">Record Type</label>
            <div className="flex gap-2 p-1 bg-gray-100 rounded-2xl">
              <button
                type="button"
                onClick={() => setFileType('prescription')}
                className={cn(
                  "flex-1 py-3 text-xs font-bold rounded-xl transition-all",
                  fileType === 'prescription' ? "bg-white text-blue-600 shadow-sm" : "text-gray-500"
                )}
              >
                Prescription
              </button>
              <button
                type="button"
                onClick={() => setFileType('report')}
                className={cn(
                  "flex-1 py-3 text-xs font-bold rounded-xl transition-all",
                  fileType === 'report' ? "bg-white text-blue-600 shadow-sm" : "text-gray-500"
                )}
              >
                Report
              </button>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-[11px] font-bold border border-red-100 flex gap-3">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!file || loading || success}
            className={cn(
              "w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all tracking-widest uppercase text-sm active:scale-[0.98]",
              loading || !file || success
                ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                : "bg-gray-900 text-white hover:bg-black shadow-xl shadow-gray-200"
            )}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : success ? (
              <>
                <CheckCircle2 className="w-5 h-5" />
                Success!
              </>
            ) : (
              'Save Record'
            )}
          </button>
        </form>
      </div>

      <div className="p-6 bg-yellow-50 rounded-3xl border border-yellow-100 flex gap-4">
        <div className="w-8 h-8 bg-yellow-200 text-yellow-700 rounded-xl flex items-center justify-center shrink-0">
          <AlertCircle className="w-4 h-4" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-yellow-800">Demo Note</h4>
          <p className="text-[11px] text-yellow-700/80 leading-relaxed font-medium italic">
            This demo uses local storage. Files are stored directly in your browser. Large files will fail to save.
          </p>
        </div>
      </div>
    </div>
  );
}
