import React from 'react';
import '../app.css';  

// Importar los componentes que ya tienes creados
import Header from '../landing/Header';
import Footer from '../landing/Footer';
import Login from '../login/register/login';  // Asegúrate de que la ruta de importación sea correcta

const App = () => {
  return (
    <div className="font-sans bg-gray-50 text-gray-900">
      {/* Header del sitio */}
      <Header />

      {/* Login */}
      <Login />  {/* Aquí se renderiza el componente Login */}

      {/* Pie de página */}
      <Footer />
    </div>
  );
}

export default App;  {/* Exportamos correctamente el componente App */}
