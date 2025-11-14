import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../hooks/useAdminAuth";

export default function Dashboard() {
  const navigate = useNavigate();
  const { token } = useAdminAuth(); // token from AdminAuthProvider

  useEffect(() => {
    if (!token) {
      // Redirect to login if not authenticated
      navigate("/login", { replace: true });
    }
  }, [token, navigate]); // Re-run if token changes

  if (!token) return null; // optional: render nothing while redirecting

  return (
    <div>
      <h1>Dashboard</h1>
      {/* Other dashboard content */}
    </div>
  );
}
