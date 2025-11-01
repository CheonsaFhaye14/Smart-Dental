import { StrictMode } from "react"; 
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // <-- BrowserRouter here
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter basename="/Smart-Dental/"> {/* <-- basename for GitHub Pages */}
      <App />
    </BrowserRouter>
  </StrictMode>
);
