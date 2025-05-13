import React, { useState, useEffect, useRef } from "react";

const Events = () => {
  const events = [
    {
      id: 1,
      name: "Cena de Navidad",
      date: "20 de diciembre de 2024",
      description: "Celebra con nosotros la mágica noche de Navidad con una cena especial de 4 tiempos.",
      image: "/images/cena-navidad.jpg",
      link: "https://www.ejemplo.com/cena-navidad"
    },
    {
      id: 2,
      name: "Fiesta de Año Nuevo",
      date: "31 de diciembre de 2024",
      description: "La mejor fiesta de Año Nuevo, con música en vivo, comida deliciosa y muchas sorpresas.",
      image: "/images/fiesta-ano-nuevo.jpg",
      link: "https://www.ejemplo.com/fiesta-ano-nuevo"
    },
    {
      id: 3,
      name: "Concierto en Vivo",
      date: "15 de enero de 2025",
      description: "Disfruta de música en vivo en el Bar Pepín con artistas locales de renombre.",
      image: "/images/concierto-en-vivo.jpg",
      link: "https://www.ejemplo.com/concierto-en-vivo"
    },
  ];

  const [isVisible, setIsVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isImageOpen, setIsImageOpen] = useState(false);

  const sectionRef = useRef(null);

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

  const openImage = (imageUrl) => {
    setSelectedImage(imageUrl);
    setTimeout(() => setIsImageOpen(true), 20);
  };

  const closeImage = () => {
    setIsImageOpen(false);
    setTimeout(() => setSelectedImage(null), 300);
  };

  return (
    <div>
      {/* Sección de Eventos */}
      <section
        id="eventos"
        ref={sectionRef}
        className="py-16 px-4 bg-white text-center"
      >
        <h2
          className={`text-4xl font-semibold text-gray-800 mb-6 transition-all duration-700 ease-in-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Eventos Pasados
        </h2>
        <p className="text-lg text-gray-600 mb-12">
          ¡Revive los momentos más especiales en Bar Pepín con nuestros eventos exclusivos!
        </p>

        {/* Contenedor para los eventos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <div
              key={event.id}
              className={`bg-black bg-opacity-60 p-6 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer border-2 border-gray-500 transform ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }} // Animación en cascada
              onClick={() => openImage(event.image)}
            >
              <div>
                <img
                  src={event.image}
                  alt={`Imagen de ${event.name}`}
                  className="w-full h-48 object-cover rounded-t-lg mb-4 transition-all duration-300 transform hover:scale-105"
                  loading="lazy"
                />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-2">{event.name}</h3>
              <p className="text-sm text-gray-300 mb-4">{event.date}</p>
              <p className="text-base text-gray-200 mb-4">{event.description}</p>
              <a
                href={event.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 transition-all duration-300"
              >
                Más Información
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Modal de imagen ampliada */}
      {selectedImage && (
        <div
          className={`
            fixed inset-0 z-50 flex items-center justify-center
            bg-black bg-opacity-40 backdrop-blur-sm
            transition-all duration-500 ease-in-out
            ${isImageOpen ? "opacity-100 scale-100" : "opacity-0 scale-90"}
          `}
        >
          <div className="relative bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.3)] border border-white/30 max-w-5xl w-full mx-4 transform transition-all duration-500 ease-in-out">
            <button
              onClick={closeImage}
              className="absolute top-4 right-6 text-3xl text-black hover:text-red-500 font-bold"
            >
              &times;
            </button>
            <div className="flex flex-col lg:flex-row gap-6 items-center">
              <img
                src={selectedImage}
                alt="Imagen ampliada"
                className="w-full lg:w-1/2 h-auto rounded-lg object-cover"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
