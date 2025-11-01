import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../hooks/useAdminAuth";

export default function Dashboard() {
  const navigate = useNavigate();
  const { token } = useAdminAuth();

  useEffect(() => {
    if (!token) navigate("/login"); // ⛔ Kick out if not authenticated
  }, [navigate, token]);

  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  );
}
