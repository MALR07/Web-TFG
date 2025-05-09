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
  );
};

export default History;
