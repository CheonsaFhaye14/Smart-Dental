import { Outlet } from "react-router-dom";
import PublicNavbar from "../components/navigation/PublicNavbar";
import PublicFooter from "../components/navigation/PublicFooter";
import "./PublicLayout.css";

export default function PublicLayout() {
  return (
    <div className="public-layout">
      <PublicNavbar />

      <main className="public-content">
        <Outlet />
      </main>

      <PublicFooter />
    </div>
  );
}