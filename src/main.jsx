import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom"; 
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HashRouter basename="/"> 
    {/* change to / if local and /Smart-Dental/ if hosted */}
      <App />
    </HashRouter>
  </StrictMode>
);
