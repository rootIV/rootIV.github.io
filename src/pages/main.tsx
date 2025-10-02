import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from "../context/AuthContext";
import App from './App.tsx'
import '../styles/index.scss'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)
