import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initGTM } from "./utils/gtm";

// Initialize Google Tag Manager
initGTM();

createRoot(document.getElementById("root")!).render(<App />);
