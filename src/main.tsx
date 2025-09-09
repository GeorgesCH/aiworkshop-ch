
  import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./styles/critical.css"; // Load critical CSS first
import "./index-clean.css";
import "./styles/globals.css";

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
  