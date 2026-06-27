import './App.css';
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Suspense, lazy } from 'react';
import GlobalSpinner from './components/ui/Globalspinner';

// ✅ Updated path
const Home = lazy(() => import('./features/public/pages/Home'));
const LearnMore = lazy(() => import('./features/public/pages/LearnMore'));
const DownloadApp = lazy(() => import('./features/public/pages/DownloadApp'));
const Login = lazy(() => import('./features/auth/pages/Login'));
const ResetPassword = lazy(() => import('./features/auth/pages/ResetPassword'));

import Dashboard from './pages/Dashboard';
import Appointments from './pages/Appointments';
import Services from './pages/Services';
import Users from './pages/Users';

import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';

import { AdminAuthProvider } from './context/AdminAuthProvider';
import { useAdminAuth } from './hooks/useAdminAuth';

function ProtectedAdminRoute() {
  const { token } = useAdminAuth();
  if (!token) return <Navigate to="/login" replace />;
  return <AdminLayout><Outlet /></AdminLayout>;
}

function App() {
  return (
    <AdminAuthProvider>
      <Suspense fallback={<GlobalSpinner />}>
        <Routes>

        {/* ── Public layout route (one wrapper for all) ── */}
        <Route element={<PublicLayout />}>
          <Route path="/"               element={<Home />}        />
          <Route path="/learn-more"    element={<LearnMore />}   />
          <Route path="/DownloadApp"      element={<DownloadApp />}    />
          <Route path="/login"         element={<Login />}       />
          <Route path="/reset-password" element={<ResetPassword />}/>
          <Route path="*"              element={<Home />}        />
        </Route>

        {/* ── Protected admin routes ── */}
        <Route element={<ProtectedAdminRoute />}>
          <Route path="/dashboard"    element={<Dashboard />}   />
          <Route path="/users"        element={<Users />}       />
          <Route path="/services"     element={<Services />}    />
          <Route path="/appointments" element={<Appointments />}/>
        </Route>

      </Routes>
      </Suspense>
    </AdminAuthProvider>
  );
}

export default App;