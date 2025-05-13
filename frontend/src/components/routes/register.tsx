import React from 'react';
import '../../App.css';

// Importar los componentes que ya tienes creados
import Register from '../login/register';
import ForgotPassword from '../login/ForgotPassword';

const App = () => {
  return (
    <div className="font-sans bg-gray-50 text-gray-900">
      <main className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Bienvenido a la Aplicación</h1>
        <div className="flex justify-center">
          <Register />
          <ForgotPassword />
        </div>
      </main>
    </div>
  );
}

export default App;
