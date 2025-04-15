import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Navbar from "./componentes/navbar/Navbar";
import './index.css'
import App from './App.tsx'

const rootElement = document.getElementById("root");

if (!rootElement) throw new Error("root element not found");

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div style={{ display: "inline-block", width: "1366px" }} data-ignore="used only for top most containter width">
    <Navbar />
    </div>
    <App />
  </StrictMode>,
)
