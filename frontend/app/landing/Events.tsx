import React, { useState } from "react";

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
    // Agrega más eventos según sea necesario
  ];

  // Estado para gestionar la imagen ampliada
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  // Función para manejar la ampliación de la imagen
  const handleImageClick = (image: string) => {
    setExpandedImage(image);
  };

  // Función para cerrar la imagen ampliada
  const handleCloseImage = () => {
    setExpandedImage(null);
  };

  return (
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
                alt={event.name}
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
              className="max-w-full max-h-full object-contain rounded-lg shadow-xl transform transition-all duration-500 ease-in-out scale-110"
              style={{
                transform: expandedImage ? "scale(1)" : "scale(0)",
                transition: "transform 0.3s ease-in-out, opacity 0.3s ease-in-out"
              }}
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
  );
};

export default Events;
