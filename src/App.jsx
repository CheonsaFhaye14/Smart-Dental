import './App.css';
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Suspense, lazy, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import GlobalSpinner from './components/ui/LoadingScreen/Globalspinner';
import { AdminAuthProvider } from './context/AdminAuthProvider';
import { useAdminAuth } from './hooks/useAdminAuth';

// ── Public pages ──────────────────────────────────────
const Home          = lazy(() => import('./features/public/pages/Home'));
const LearnMore     = lazy(() => import('./features/public/pages/LearnMore'));
const DownloadApp   = lazy(() => import('./features/public/pages/DownloadApp'));
const Login         = lazy(() => import('./features/auth/pages/Login'));
const ResetPassword = lazy(() => import('./features/auth/pages/ResetPassword'));

// ── Admin pages ───────────────────────────────────────
const Users         = lazy(() => import('./features/users/Users'));

// ── Layouts ───────────────────────────────────────────
const PublicLayout  = lazy(() => import('./layouts/PublicLayout'));
const AdminLayout   = lazy(() => import('./layouts/AdminLayout'));

function ProtectedAdminRoute() {
  const { token, logout } = useAdminAuth();

  const isExpired = () => {
    if (!token) return true;
    try {
      const { exp } = jwtDecode(token);
      return Date.now() >= exp * 1000;
    } catch {
      return true;
    }
  };

  const expired = isExpired();

useEffect(() => {
  if (expired) logout();
}, [expired, logout]); 

  if (!token || expired) return <Navigate to="/login" replace />;

  return <AdminLayout><Outlet /></AdminLayout>;
}

function App() {
  return (
    <AdminAuthProvider>
      <Suspense fallback={<GlobalSpinner />}>
        <Routes>

          {/* ── Public routes ── */}
          <Route element={<PublicLayout />}>
            <Route path="/"               element={<Home />}          />
            <Route path="/learn-more"     element={<LearnMore />}     />
            <Route path="/downloadapp"    element={<DownloadApp />}   />
            <Route path="/login"          element={<Login />}         />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="*"              element={<Home />}           />
          </Route>

          {/* ── Protected admin routes ── */}
          <Route element={<ProtectedAdminRoute />}>
            <Route path="/users" element={<Users />} />
          </Route>

        </Routes>
      </Suspense>
    </AdminAuthProvider>
  );
}

export default App;