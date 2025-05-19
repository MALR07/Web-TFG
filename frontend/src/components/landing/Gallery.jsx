import React, { useState, useEffect, useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Flechas personalizadas con animación de entrada
const PrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-70 text-white text-3xl w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300"
  >
    ‹
  </button>
);

const NextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-70 text-white text-3xl w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300"
  >
    ›
  </button>
);

const Carousel = () => {
  const images = [
    '/gente2.jpg',
    '/gente.jpg',
    'poker.jpg',
    '/cantar2.jpg',
    '/gente3.jpg',
    '/servir2.jpg',
    '/fotogrande1.jpeg',
  ];

  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
  };

  // Usamos IntersectionObserver para la visibilidad de la sección
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  return (
    <div>
      {/* Sección del Carrusel */}
      <section
        id="galeria"
        ref={sectionRef}
        className="py-16 px-4 bg-white text-center"
      >
        <h2
          className={`text-4xl font-semibold text-gray-800 mb-6 transition-all duration-700 ease-in-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          Galería
        </h2>

        {/* Carrusel con animación de entrada */}
        <div
          className={`relative max-w-6xl mx-auto overflow-hidden rounded-xl shadow-lg transform transition-all duration-700 ease-in-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <Slider {...settings}>
            {images.map((image, index) => (
              <div key={index} className="animate__animated animate__fadeIn">
                <img
                  src={image}
                  alt={`Carrusel ${index}`}
                  className="w-full h-[600px] object-cover"
                />
              </div>
            ))}
          </Slider>
        </div>
      </section>
    </div>
  );
};

export default Carousel;
