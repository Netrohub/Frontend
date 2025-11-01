import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initGTM } from "./utils/gtm";

// Validate environment variables on startup
// Import env config to trigger validation (throws if invalid)
import './config/env';

// Initialize Google Tag Manager
initGTM();

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(<App />);
