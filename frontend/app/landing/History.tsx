import { useEffect, useState, useRef } from "react";

const History = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true); // Cuando el módulo entra en el viewport, activa la animación
        }
      },
      { threshold: 0.5 } // El 50% de la sección debe estar visible
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current); // Observa la sección
    }

    // Cleanup observer
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <div>
      <section
        id="historia"
        ref={sectionRef} // Añadir referencia a la sección
        className="py-16 px-4 bg-gray-100 text-center"
      >
        <h2
          className={`text-4xl font-semibold text-gray-800 mb-12 transform transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          Nuestra Historia
        </h2>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Caja 1 - Imagen a la izquierda, texto a la derecha */}
          <div
            className={`flex items-center bg-black bg-opacity-70 p-8 rounded-lg shadow-lg h-full ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            } transition-all duration-700 ease-out`}
          >
            <div className="w-full lg:w-1/2 mb-4 lg:mb-0 relative">
              <img
                src="https://source.unsplash.com/1600x900/?restaurant"
                alt="Imagen Historia 1"
                className="w-full h-64 object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black opacity-30 rounded-lg"></div> {/* Difuminado en el fondo de la imagen */}
            </div>
            <div className="w-full lg:w-1/2 text-white text-left">
              <p className="text-lg">
                Fundado en 2025, nuestro restaurante nació con la idea de ofrecer una experiencia gastronómica única. Con un enfoque en platos tradicionales y un ambiente acogedor, queremos que cada cliente se sienta como en casa.
              </p>
            </div>
          </div>

          {/* Caja 2 - Imagen a la derecha, texto a la izquierda */}
          <div
            className={`flex items-center bg-black bg-opacity-70 p-8 rounded-lg shadow-lg h-full ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            } transition-all duration-700 ease-out`}
          >
            <div className="w-full lg:w-1/2 mb-4 lg:mb-0 relative order-last lg:order-first">
              <img
                src="https://source.unsplash.com/1600x900/?bar"
                alt="Imagen Historia 2"
                className="w-full h-64 object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black opacity-30 rounded-lg"></div> {/* Difuminado en el fondo de la imagen */}
            </div>
            <div className="w-full lg:w-1/2 text-white text-left">
              <p className="text-lg">
                A lo largo de los años, hemos evolucionado y ampliado nuestro menú, pero siempre manteniendo el sabor auténtico de la cocina tradicional. Ven y descubre por qué Bar Pepin es más que un simple restaurante, es una experiencia.
              </p>
            </div>
          </div>
        </div>
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
          className={`flex justify-center bg-black bg-opacity-70 rounded-lg p-8 shadow-lg ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          } transition-all duration-700 ease-out`}
        >
          {/* Mapa de Google - Reemplaza la URL con tu ubicación */}
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
      </section>
    </div>
  );
};

export default History;
