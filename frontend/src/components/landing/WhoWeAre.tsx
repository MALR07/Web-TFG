import { useEffect, useState } from "react";

const WhoWeAre = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Manejar la visibilidad de los textos al cargar la página
  useEffect(() => {
    setTimeout(() => {
      setIsVisible(true); // Esto hace que los textos entren al cargar
    }, 300); // Retraso reducido a 300ms
  }, []);

  // Efecto para detectar cuando se hace scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollFraction = scrollY / docHeight;
      setScrollProgress(scrollFraction); // Guardamos el progreso del scroll como fracción entre 0 y 1
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`relative bg-cover bg-center h-screen flex items-center justify-center text-white text-center transition-all duration-500 ease-in-out transform`}
      style={{
        backgroundImage: "url('/fondoreserva.jpeg')", // Ruta de tu imagen
        backgroundSize: "cover",
        backgroundPosition: "center",
        opacity: 1 - scrollProgress, // La imagen se va difuminando a medida que se hace scroll
        transform: `translateY(${scrollProgress * 40}px)`, // Efecto de parallax
      }}
    >
      {/* Capa oscura que se aplica a la imagen con desenfoque */}
      <div
        className={`absolute inset-0 bg-black transition-all duration-500 ease-in-out`}
        style={{
          opacity: Math.min(scrollProgress * 2, 0.7), // La capa negra se hace más oscura con el scroll
          filter: "blur(5px)", // Desenfoque suave en el fondo
        }}
      ></div>

      <div className="relative z-10 px-4 sm:px-8 lg:px-16">
        {/* Título animado que entra desde abajo */}
        <h1
          className={`text-5xl font-bold mb-4 transform transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          Bienvenido a Bar Pepin
        </h1>

        {/* Descripción animada que entra desde abajo */}
        <p
          className={`text-lg mb-8 transition-all duration-700 ease-out delay-100 transform ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          ¡Disfruta de una experiencia única con nuestra selección de platos y bebidas! Un lugar para relajarte y disfrutar con amigos.
        </p>

        {/* Descripción grande animada */}
        <p
          className={`text-2xl font-semibold mb-10 transition-all duration-700 ease-out delay-200 transform ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          Cocina tradicional con un toque moderno y un ambiente acogedor.
        </p>

        {/* Botón animado que entra desde abajo */}
        <a
          href="#dishes" // Aquí cambiamos a #dishes para hacer scroll a la sección de "Platos"
          className={`px-6 py-3 bg-yellow-600 text-white text-lg font-semibold rounded-full transition-all duration-500 ease-out transform hover:scale-105 hover:shadow-lg`}
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(10px)",
          }}
        >
          Ver Platos
        </a>
      </div>
    </div>
  );
};

export default WhoWeAre;
