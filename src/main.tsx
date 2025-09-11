
  import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index-clean.css"; // Load Tailwind CSS with @theme directive and custom utilities

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
  