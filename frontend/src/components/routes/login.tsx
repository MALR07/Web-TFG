import React from 'react';
import '../../App.css';
import { Routes, Route } from 'react-router';

// Importar los componentes que ya tienes creados
import Header from '../landing/Header';
import Footer from '../landing/Footer';
import AU from '../login/Login';  // Asegúrate de que la ruta de importación sea correcta
import Register from '../routes/register';
import ForgotPassword from '../routes/changecontra';

const Login = () => {
  return (
    <div className="font-sans bg-gray-50 text-gray-900">
      {/* Header se mostrará en todas las páginas */}
      <Header />

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

      {/* Footer se mostrará en todas las páginas */}
      <Footer />
    </div>
  );
};

export default Login;
