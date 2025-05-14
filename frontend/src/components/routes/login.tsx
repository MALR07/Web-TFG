import React from 'react';
import '../../App.css';
import { Routes, Route } from 'react-router';

// Importar los componentes que ya tienes creados

import AU from '../login/Login';  // Asegúrate de que la ruta de importación sea correcta
import Register from '../routes/register';
import ForgotPassword from '../routes/changecontra';

const Login = () => {
  return (
    <div className="font-sans bg-gray-50 text-gray-900">
      <Routes>
        {/* Ruta principal (landing) */}
        <Route path="/" element={
          <>
            <AU />
          </>
        } />

        {/* Rutas para Login y Register */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </div>
  );
};

export default Login;
