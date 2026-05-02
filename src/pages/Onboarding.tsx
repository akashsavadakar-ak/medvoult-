
import { useState, type FormEvent, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, mockDb } from '../lib/mockDb';
import { Shield, ChevronRight } from 'lucide-react';

interface OnboardingProps {
  user: User;
  onComplete: () => void;
}

export default function Onboarding({ user, onComplete }: OnboardingProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: user.name || '',
    age: '',
    gender: 'Other',
    bloodGroup: 'A+',
    address: '',
    degree: '', // Only for doctor
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const updatedUser: User = {
      ...user,
      ...formData,
      onboarded: true,
      sharingEnabled: user.role === 'patient' ? true : undefined,
    };
    mockDb.saveUser(updatedUser);
    onComplete();
    navigate(user.role === 'patient' ? '/patient/dashboard' : '/doctor/dashboard');
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 flex items-center justify-center">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-blue-600 p-8 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-6 h-6 border-white/20 border rounded p-1" />
            <span className="text-xs font-bold uppercase tracking-widest text-blue-100">Profile Setup</span>
          </div>
          <h1 className="text-2xl font-bold">Welcome to MedVault</h1>
          <p className="text-blue-100 text-sm mt-1">Let's personalize your {user.role} profile.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-full">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-blue-500 rounded-2xl transition-all text-sm outline-none"
              />
            </div>

            {user.role === 'patient' ? (
              <>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Age</label>
                  <input
                    type="number"
                    name="age"
                    required
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-blue-500 rounded-2xl transition-all text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-blue-500 rounded-2xl transition-all text-sm outline-none appearance-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Blood Group</label>
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-blue-500 rounded-2xl transition-all text-sm outline-none appearance-none"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
              </>
            ) : (
              <div className="col-span-full">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Medical Degree / Specialization</label>
                <input
                  type="text"
                  name="degree"
                  required
                  placeholder="MBBS, MD Cardiology"
                  value={formData.degree}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-blue-500 rounded-2xl transition-all text-sm outline-none"
                />
              </div>
            )}

            <div className="col-span-full">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Address</label>
              <textarea
                name="address"
                required
                rows={3}
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-blue-500 rounded-2xl transition-all text-sm outline-none resize-none"
              ></textarea>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-gray-900 text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-black transition-all active:scale-[0.98]"
          >
            Complete Setup
            <ChevronRight className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
