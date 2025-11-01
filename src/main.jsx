import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* 
      For local dev: basename can be "/" or empty
      For GitHub Pages: set basename="/Smart-Dental/"
    */}
    <BrowserRouter basename={import.meta.env.DEV ? "/" : "/Smart-Dental/"}>
      <App />
    </BrowserRouter>
  </StrictMode>
);
