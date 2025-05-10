import React from 'react';
import '../app.css';  

// Importar los componentes que ya tienes creados
import Header from '../landing/Header';
import Footer from '../landing/Footer';

const App = () => {
  return (
    <div className="font-sans bg-gray-50 text-gray-900">
      {/* Header del sitio */}
      <Header />

      {/* Pie de página */}
      <Footer />
    </div>
  );
}

export default App;
