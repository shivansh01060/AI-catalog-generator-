import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { TemplateProvider } from "./context/TemplateContext";
import { AuthProvider } from "./context/AuthContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <TemplateProvider>
        <App />
      </TemplateProvider>
    </AuthProvider>
  </StrictMode>,
);
