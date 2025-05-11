import React from 'react';

const Menu = () => {
  // URL que normalmente va en el QR, puedes configurarla como una constante o obtenerla dinámicamente desde algún lugar
  const menuUrl = "https://example.com/carta"; // Cambia esto a la URL de tu carta en línea

  return (
    <section id="carta" className="py-16 px-4 bg-gray-100 text-center">
      <h2 className="text-4xl font-semibold text-gray-800 mb-6">¡Escanea el QR y descubre nuestra carta!</h2>
      <p className="text-lg text-gray-600 mb-8">Haz tu pedido de manera rápida y sencilla desde tu móvil.</p>
      
      {/* Aquí va el QR */}
      <div className="bg-gray-300 w-48 h-48 mx-auto mb-8">
        <img
          src="https://via.placeholder.com/150" // Imagen de ejemplo, reemplázalo con tu QR
          alt="Código QR para la carta"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Botón para abrir la carta en PC */}
      <div>
        <p className="text-lg text-gray-600 mb-4">¿No puedes escanear el QR? Haz clic aquí para ver la carta:</p>
        <a 
          href={menuUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-block bg-blue-500 text-white py-2 px-6 rounded-lg text-lg hover:bg-blue-600 transition"
        >
          Ver la carta
        </a>
      </div>

      <p className="text-lg text-gray-600 mt-6">¡Haz tu pedido fácilmente desde tu móvil!</p>
    </section>
  );
};

export default Menu;