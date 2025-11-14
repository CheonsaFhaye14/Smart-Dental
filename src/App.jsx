import './App.css';
import { Routes, Route } from "react-router-dom";

import HomePage from './pages/HomePage';
import Login from './pages/Login';
import About from './pages/About';
import Download from './pages/Download';
import Dashboard from './pages/Dashboard';
import Appointments from './pages/Appointments';
import Services from './pages/Services';
import Users from './pages/Users';
import ResetPassword from './pages/ResetPassword';

import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import { AdminAuthProvider } from './context/AdminAuthProvider';
import { useAdminAuth } from './hooks/useAdminAuth';

import { Navigate } from "react-router-dom";

function ProtectedAdminRoute({ children }) {
  const { token } = useAdminAuth();
  if (!token) return <Navigate to="/login" replace />;
  return children;
}


function App() {
  return (
    <AdminAuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
        <Route path="/download" element={<PublicLayout><Download /></PublicLayout>} />
        <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
        <Route path="/reset-password" element={<PublicLayout><ResetPassword /></PublicLayout>} />

        {/* Admin Routes */}
        <Route path="/dashboard" element={<ProtectedAdminRoute><AdminLayout><Dashboard /></AdminLayout></ProtectedAdminRoute>} />
        <Route path="/users" element={<ProtectedAdminRoute><AdminLayout><Users /></AdminLayout></ProtectedAdminRoute>} />
        <Route path="/services" element={<ProtectedAdminRoute><AdminLayout><Services /></AdminLayout></ProtectedAdminRoute>} />
        <Route path="/appointments" element={<ProtectedAdminRoute><AdminLayout><Appointments /></AdminLayout></ProtectedAdminRoute>} />

        {/* Fallback for unmatched routes */}
        <Route path="*" element={<PublicLayout><HomePage /></PublicLayout>} />
      </Routes>
    </AdminAuthProvider>
  );
}

export default App;
