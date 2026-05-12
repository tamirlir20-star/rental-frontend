import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { getCities } from './hooks/useCities'

// Wake up the Render free-tier server and pre-warm the cities cache
// before any user interaction happens.
const BASE = import.meta.env.VITE_API_URL ?? "https://rental-scraper-qlol.onrender.com";
fetch(`${BASE}/health`).catch(() => {});
getCities().catch(() => {});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
