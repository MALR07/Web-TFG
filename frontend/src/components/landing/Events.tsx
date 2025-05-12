import React, { useState, useEffect } from "react";

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

  // Estado para gestionar la imagen ampliada
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  // Función para manejar la ampliación de la imagen
  const handleImageClick = (image: string) => {
    setExpandedImage(image);
  };

  // Función para cerrar la imagen ampliada
  const handleCloseImage = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evita que el clic en el área de fondo cierre la imagen
    setExpandedImage(null);
  };

  const [isVisible, setIsVisible] = useState(false);

  // Detectar cuando el usuario hace scroll para aplicar animación
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      {/* Sección de Eventos */}
      <section id="eventos" className="py-16 px-4 bg-white text-center">
        <h2 className="text-4xl font-semibold text-gray-800 mb-6">Eventos Pasados</h2>
        <p className="text-lg text-gray-600 mb-12">
          ¡Revive los momentos más especiales en Bar Pepín con nuestros eventos exclusivos!
        </p>

        {/* Contenedor para los eventos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-gray-100 p-6 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer"
            >
              <div onClick={() => handleImageClick(event.image)}>
                <img
                  src={event.image}
                  alt={`Imagen de ${event.name}`}
                  loading="lazy"  // Lazy loading para mejorar el rendimiento
                  className="w-full h-48 object-cover rounded-t-lg mb-4 transition-all duration-300 transform hover:scale-105"
                />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">{event.name}</h3>
              <p className="text-sm text-gray-500 mb-4">{event.date}</p>
              <p className="text-base text-gray-600 mb-4">{event.description}</p>
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

        {/* Mostrar la imagen ampliada con animación */}
        {expandedImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
            onClick={handleCloseImage}
          >
            <div
              className="relative"
              onClick={(e) => e.stopPropagation()} // Evita que el clic en la imagen cierre la vista previa
            >
              <img
                src={expandedImage}
                alt="Imagen ampliada"
                className="max-w-full max-h-full object-contain rounded-lg shadow-xl border-4 border-white transform transition-all duration-500 ease-in-out scale-110"
              />
              {/* Botón de Cerrar */}
              <button
                onClick={handleCloseImage}
                className="absolute top-4 right-4 text-white text-3xl font-bold bg-black bg-opacity-60 p-2 rounded-full hover:bg-opacity-70 transition"
              >
                X
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Nueva sección "Encuéntranos" con el mapa */}
      <section
        id="encuentranos"
        className="py-16 px-4 bg-gray-100 text-center"
      >
        <h2
          className={`text-4xl font-semibold text-gray-800 mb-12 transform transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          Encuéntranos
        </h2>

        <div
          className={`flex flex-col lg:flex-row justify-between items-center gap-12 lg:gap-20 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* Dirección */}
          <div className="w-full lg:w-1/3 text-center lg:text-left">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Dirección</h3>
            <p className="text-lg text-gray-600 mb-4">
              Visítanos en nuestra ubicación:
            </p>
            <p className="text-lg font-medium text-gray-800">
              1600 Folsom St, San Francisco, CA 94107, USA
            </p>
            <p className="text-md text-gray-500 mt-2">
              ¡Te esperamos con los brazos abiertos!
            </p>
          </div>

          {/* Mapa de Google */}
          <div className="w-full lg:w-2/3 bg-black rounded-lg shadow-lg overflow-hidden">
            <iframe
              width="100%"
              height="450"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.209888473908!2d-122.41941628468158!3d37.77492977975809!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80858183adf57a17%3A0x25f658a970b9f4d!2s1600%20Folsom%20St%2C%20San%20Francisco%2C%20CA%2094170%2C%20USA!5e0!3m2!1ses-419!2smx!4v1634062237051!5m2!1ses-419!2smx"
              title="Ubicación del restaurante"
              frameBorder="0"
              style={{ border: "0" }}
              allowFullScreen
              aria-hidden="false"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Events;

