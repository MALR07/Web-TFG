import React from 'react';
import '../../App.css';

// Importar los componentes que ya tienes creados
import Register from '../login/register';

const App = () => {
  return (
    <div className="font-sans bg-gray-50 text-gray-900">
      <main className="container mx-auto py-8">
        <div className="flex justify-center">
          <Register />
        </div>
      </main>
    </div>
  );
}

export default App;
