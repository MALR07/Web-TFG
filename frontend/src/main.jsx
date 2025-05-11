import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Importamos BrowserRouter
import './index.css'; // Estilos globales
import App from './App'; // Importa tu archivo App

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> {/* Aquí envolvemos la aplicación en BrowserRouter */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
