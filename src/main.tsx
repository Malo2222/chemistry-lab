import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

document.documentElement.setAttribute('data-theme', 'dark');
document.documentElement.classList.add('dark');  // Add this line

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);