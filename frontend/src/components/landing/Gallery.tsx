import React from 'react'; // npm install slick-carousel react-slick
import Slider from 'react-slick'; // Importa react-slick
import 'slick-carousel/slick/slick.css'; // Importa los estilos de slick
import 'slick-carousel/slick/slick-theme.css'; // Importa el tema de slick

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

  // Configuración de Slick Carousel
  const settings = {
    dots: true, // Muestra los puntos de navegación
    infinite: true, // El carrusel es infinito (una vez que llega al final vuelve al inicio)
    speed: 500, // Velocidad de transición
    slidesToShow: 1, // Número de imágenes a mostrar en una vez
    slidesToScroll: 1, // Número de imágenes a desplazar en cada clic
    autoplay: true, // Hace que el carrusel avance automáticamente
    autoplaySpeed: 3000, // Tiempo entre cada cambio de imagen
    prevArrow: (
      <button className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full shadow-md hover:bg-gray-700 transition duration-300">
        &lt;
      </button>
    ),
    nextArrow: (
      <button className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full shadow-md hover:bg-gray-700 transition duration-300">
        &gt;
      </button>
    ),
  };

  return (
    <section id="galeria" className="py-16 px-4 bg-gray-100 text-center relative">
      <h2 className="text-4xl font-semibold text-gray-800 mb-6">Galería</h2>

      {/* Carrusel */}
      <div className="relative max-w-6xl mx-auto">
        <Slider {...settings}>
          {images.map((image, index) => (
            <div key={index}>
              <img
                src={image}
                alt={`Carrusel ${index}`}
                className="w-full h-[600px] object-cover transition-all duration-500 ease-in-out"
              />
            </div>
          ))}
        </Slider>
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
