/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, type ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { mockDb, User } from './lib/mockDb';
import Navbar from './components/Navbar';

// Pages
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import PatientDashboard from './pages/PatientDashboard';
import UploadRecord from './pages/UploadRecord';
import Timeline from './pages/Timeline';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientView from './pages/PatientView';

function ProtectedRoute({ 
  children, 
  user, 
  allowedRole 
}: { 
  children: ReactNode; 
  user: User | null; 
  allowedRole?: 'patient' | 'doctor' 
}) {
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={user.role === 'patient' ? '/patient/dashboard' : '/doctor/dashboard'} replace />;
  }

  if (!user.onboarded && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = mockDb.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const handleAuthChange = () => {
    setUser(mockDb.getCurrentUser());
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-blue-600">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-current"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        <Navbar user={user} onLogout={() => setUser(null)} />
        
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route 
              path="/login" 
              element={
                user ? (
                  <Navigate to={user.role === 'patient' ? '/patient/dashboard' : '/doctor/dashboard'} replace />
                ) : (
                  <Login onLogin={handleAuthChange} />
                )
              } 
            />
            
            <Route 
              path="/onboarding" 
              element={
                <ProtectedRoute user={user}>
                  <Onboarding user={user!} onComplete={handleAuthChange} />
                </ProtectedRoute>
              } 
            />

            {/* Patient Routes */}
            <Route 
              path="/patient/dashboard" 
              element={
                <ProtectedRoute user={user} allowedRole="patient">
                  <PatientDashboard user={user!} onUpdate={handleAuthChange} />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/patient/upload" 
              element={
                <ProtectedRoute user={user} allowedRole="patient">
                  <UploadRecord user={user!} />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/patient/timeline" 
              element={
                <ProtectedRoute user={user} allowedRole="patient">
                  <Timeline user={user!} />
                </ProtectedRoute>
              } 
            />

            {/* Doctor Routes */}
            <Route 
              path="/doctor/dashboard" 
              element={
                <ProtectedRoute user={user} allowedRole="doctor">
                  <DoctorDashboard user={user!} />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/doctor/patient/:id" 
              element={
                <ProtectedRoute user={user} allowedRole="doctor">
                  <PatientView />
                </ProtectedRoute>
              } 
            />

            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
