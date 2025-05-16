import React, { useEffect, useState } from 'react';

const Menu = () => {
  const menuUrl = "https://drive.google.com/file/d/1aoWzFCiE7ocR1Ir9RWPDOzjB4_2CCG5E/view?usp=drive_link"; // Cambia por la URL real del QR

  const [isVisible, setIsVisible] = useState(false);

  // Detectar si el componente está en viewport para activar la animación
  useEffect(() => {
    const onScroll = () => {
      const section = document.getElementById('carta');
      if (!section) return;
      const rect = section.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom >= 0) {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', onScroll);
    onScroll(); // para detectar si ya está visible al montar
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section
      id="carta"
      className={`py-16 px-8 bg-gray-100 max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10
        transition-all duration-700 ease-out
        ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}
      style={{ minHeight: '350px' }}
    >
      {/* Texto a la izquierda */}
      <div className="flex-1 text-left">
        <h2 className="text-4xl font-semibold text-gray-800 mb-6">¡Escanea el QR y descubre nuestra carta!</h2>
        <p className="text-lg text-gray-600 mb-8">
          Haz tu pedido de manera rápida y sencilla desde tu móvil.
        </p>

        <p className="text-lg text-gray-600 mb-4">
          ¿No puedes escanear el QR? Haz clic aquí para ver la carta:
        </p>
        <a
          href={menuUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-blue-500 text-white py-2 px-6 rounded-lg text-lg hover:bg-blue-600 transition"
        >
          Ver la carta
        </a>

        <p className="text-lg text-gray-600 mt-6">¡Haz tu pedido fácilmente desde tu móvil!</p>
      </div>

      {/* QR a la derecha */}
      <div className="flex-1 flex justify-center md:justify-end">
        <img
          src="/QRCarta.png" // Cambia por la ruta real dentro de public
          alt="Código QR para la carta"
          className="w-48 h-48 shadow-lg rounded-lg object-cover"
        />
      </div>
    </section>
  );
};

export default Menu;
