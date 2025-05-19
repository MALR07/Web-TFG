import { useEffect, useState, useRef } from "react";

const History = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isEncuentranosVisible, setIsEncuentranosVisible] = useState(false); // Estado para "Encuéntranos"
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const sectionRef = useRef(null);
  const encuentranosRef = useRef(null); // Referencia para "Encuéntranos"

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsEncuentranosVisible(true);
      },
      { threshold: 0.3 }
    );

    if (encuentranosRef.current) observer.observe(encuentranosRef.current);
    return () => {
      if (encuentranosRef.current) observer.unobserve(encuentranosRef.current);
    };
  }, []);

  const openImage = (imageUrl, text) => {
    setSelectedImage({ imageUrl, text });
    setTimeout(() => setIsImageOpen(true), 20);
  };

  const closeImage = () => {
    setIsImageOpen(false);
    setTimeout(() => setSelectedImage(null), 300);
  };

  return (
    <div>
      {/* Sección Historia */}
      <section
        id="historia"
        ref={sectionRef}
        className="py-16 px-4 bg-white text-center"
      >
        <h2
          className={`text-4xl font-semibold text-gray-800 mb-12 transition-all duration-700 ease-in-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Nuestra Historia
        </h2>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Historia 1 */}
          <div
            className={`flex items-center bg-black bg-opacity-50 p-8 rounded-xl shadow-xl h-full transition-all duration-700 ease-in-out transform ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            } cursor-pointer`}
            onClick={() =>
              openImage(
                "/historia 2.JPG",
                "Nuestro Bar nació con la idea de sacar a delante a una familia que a dia de hoy tras una generacion sigue adelante."
              )
            }
          >
            <div className="w-full lg:w-1/2 mb-4 lg:mb-0 relative">
              <img
                src="/historia 2.JPG"
                alt="Historia 1"
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
            <div className="w-full lg:w-1/2 text-white text-left px-4">
              <p className="text-xl">
                Nuestro Bar nació con la idea de sacar a delante a una familia que a dia de hoy tras una generacion sigue adelante.
              </p>
            </div>
          </div>

          {/* Historia 2 */}
          <div
            className={`flex items-center bg-black bg-opacity-50 p-8 rounded-xl shadow-xl h-full transition-all duration-700 ease-in-out transform ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            } cursor-pointer`}
            onClick={() =>
              openImage(
                "/cerveza.JPG",
                "El mejor servico y la mejor comida de la zona, con un trato familiar y cercano, lo mejor del pantano."
              )
            }
          >
            <div className="w-full lg:w-1/2 mb-4 lg:mb-0 relative order-last lg:order-first">
              <img
                src="/cerveza.JPG"
                alt="Historia 2"
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
            <div className="w-full lg:w-1/2 text-white text-left px-4">
              <p className="text-xl">
                El mejor servico y la mejor comida de la zona, con un trato familiar y cercano, lo mejor del pantano.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sección Encuéntranos */}
      <section
        className="py-16 px-4 bg-white"
        id="encuentranos"
        ref={encuentranosRef}
      >
        <h3
          className={`text-3xl font-bold text-center mb-12 transition-all duration-1000 ease-in-out ${
            isEncuentranosVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          Encuentra Nuestro Restaurante
        </h3>

        <div
          className={`max-w-7xl mx-auto transition-all duration-1000 ease-in-out ${
            isEncuentranosVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <div className="w-full backdrop-blur-md bg-black bg-opacity-40 p-10 rounded-xl shadow-xl flex flex-col lg:flex-row items-center justify-between space-y-10 lg:space-y-0 lg:space-x-10">
            {/* Dirección */}
            <div className="text-white w-full lg:w-1/2 text-center lg:text-left">
              <p className="text-2xl mb-4">Visítanos:</p>
              <p className="text-xl font-medium mb-4">
                Avenida del Pantano 87, Moron de la Frontera, Sevilla 
              </p>
              <p className="text-md text-gray-300">
                ¡Te esperamos con los brazos abiertos!
              </p>
            </div>

            {/* Mapa */}
            <div className="w-full lg:w-1/2">
              <iframe
                width="100%"
                height="300"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3180.929304870762!2d-5.453944210863741!3d37.13059690035807!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd0d61a7750efd71%3A0x90e7785ad78b7715!2sBAR%20PEP%C3%8DN.!5e0!3m2!1ses!2ses!4v1747407288749!5m2!1ses!2ses" 
                title="Ubicación de nuestro Bar"
                frameBorder="0"
                style={{ border: "0", borderRadius: "8px" }}
                allowFullScreen
                aria-hidden="false"
              ></iframe>
            </div>
          </div>
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
                src={selectedImage.imageUrl}
                alt="Imagen ampliada"
                className="w-full lg:w-1/2 h-auto rounded-lg object-cover"
              />
              <div className="text-left text-lg text-gray-900">{selectedImage.text}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
