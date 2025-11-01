import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../hooks/useAdminAuth";

export default function Dashboard() {
  const navigate = useNavigate();
  const { token } = useAdminAuth();

  useEffect(() => {
    if (!token) {
      // Navigate to login respecting basename
      navigate("/login", { replace: true }); // ✅ keep it simple
    }
  }, [navigate, token]);

  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  );
}
