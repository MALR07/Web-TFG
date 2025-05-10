import React, { useState, useEffect } from 'react';

const Carousel = () => {
  // Array de imágenes para el carrusel
  const images = [
    'https://source.unsplash.com/1600x900/?restaurant',
    'https://source.unsplash.com/1600x900/?food',
    'https://source.unsplash.com/1600x900/?dining',
    'https://source.unsplash.com/1600x900/?coffee',
    'https://source.unsplash.com/1600x900/?bar',
    'https://source.unsplash.com/1600x900/?wine',
    'https://source.unsplash.com/1600x900/?celebration',
  ];

  // Estado para el índice de la imagen actual
  const [currentIndex, setCurrentIndex] = useState(0);

  // Función para avanzar al siguiente slide
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  // Función para retroceder al slide anterior
  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // Use effect para el auto-scroll (cada 3 segundos)
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000); // Cambia la imagen cada 3 segundos

    return () => clearInterval(interval); // Limpia el intervalo cuando el componente se desmonte
  }, []);

  return (
    <section id="galeria" className="py-16 px-4 bg-gray-100 text-center">
      <h2 className="text-4xl font-semibold text-gray-800 mb-6">Galería</h2>

      {/* Carrusel */}
      <div className="relative max-w-6xl mx-auto">
        <div className="h-[600px] bg-gray-300 relative overflow-hidden"> {/* Aumentamos la altura */}
          {/* Imagen actual del carrusel */}
          <img
            src={images[currentIndex]}
            alt="Carrusel"
            className="w-full h-full object-cover transition-all duration-500 ease-in-out transform"
          />
        </div>

        {/* Botones de navegación */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white text-gray-800 p-3 rounded-full shadow-lg"
        >
          &#10094;
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white text-gray-800 p-3 rounded-full shadow-lg"
        >
          &#10095;
        </button>
      </div>

      {/* Botón de "Ver Más" que redirige a Facebook */}
      <div className="mt-8">
        <a
          href="https://www.facebook.com/people/Bar-Pepin/100064156744460/#"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Ver más
        </a>
      </div>
    </section>
  );
};

export default Carousel;
