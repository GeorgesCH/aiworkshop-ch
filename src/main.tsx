
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css"; // Load Tailwind CSS with optimized font configuration
import { initializeFontLoading } from "./utils/font-loader";

// Initialize font loading for optimal performance
initializeFontLoading();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
  