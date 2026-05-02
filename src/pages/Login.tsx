
import { useState, type FormEvent } from 'react';
import { Shield, Mail, Lock } from 'lucide-react';
import { mockDb, Role } from '../lib/mockDb';
import { cn } from '../lib/utils';

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [role, setRole] = useState<Role>('patient');
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // Only for signup
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (isSignUp) {
      if (mockDb.getUserByEmail(email)) {
        setError('User already exists');
        return;
      }
      const newUser = {
        id: Math.random().toString(36).substring(7),
        email,
        name,
        role,
        onboarded: false,
      };
      mockDb.saveUser(newUser as any);
      mockDb.login(newUser.id);
      onLogin();
    } else {
      const user = mockDb.getUserByEmail(email);
      if (user && user.role === role) {
        // In this local mock, we don't check password
        mockDb.login(user.id);
        onLogin();
      } else {
        setError('Invalid credentials or wrong role selected');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 text-white mb-4 shadow-lg shadow-blue-200">
            <Shield className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">MedVault</h2>
          <p className="mt-2 text-sm text-gray-500 font-medium italic">Your portable medical sanctuary</p>
        </div>

        <div className="flex p-1 bg-gray-100 rounded-2xl">
          <button
            onClick={() => setRole('patient')}
            className={cn(
              "flex-1 py-2 text-sm font-semibold rounded-xl transition-all",
              role === 'patient' ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
            )}
          >
            Patient
          </button>
          <button
            onClick={() => setRole('doctor')}
            className={cn(
              "flex-1 py-2 text-sm font-semibold rounded-xl transition-all",
              role === 'doctor' ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
            )}
          >
            Doctor
          </button>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-medium border border-red-100 animate-pulse">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 px-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-0 rounded-2xl transition-all text-sm outline-none"
                  placeholder="John Doe"
                />
              </div>
            )}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 px-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-0 rounded-2xl transition-all text-sm outline-none"
                  placeholder="example@mail.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 px-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-0 rounded-2xl transition-all text-sm outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 px-6 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] rounded-2xl shadow-lg shadow-blue-200 transition-all uppercase tracking-widest"
          >
            {isSignUp ? 'Create Account' : 'Sign In'}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm font-semibold text-blue-600 hover:text-blue-500 transition-colors"
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
