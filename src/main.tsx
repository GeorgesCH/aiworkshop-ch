
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css"; // Load Tailwind CSS with optimized font configuration

// Defer font loading to avoid blocking initial render
setTimeout(() => {
  import("./utils/font-loader").then(({ initializeFontLoading }) => {
    initializeFontLoading();
  }).catch(console.error);
}, 100);

// Optimize initial render
const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
  