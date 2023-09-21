import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { makeServer } from "./mirage/config.js";

if (process.env.NODE_ENV === "development") {
  makeServer("development"); // Start Mirage server in development environment
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
