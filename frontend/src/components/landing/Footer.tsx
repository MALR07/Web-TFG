import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white py-6 w-full">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 md:px-10">
        {/* Izquierda: Logo y Facebook */}
        <div className="flex items-center space-x-4 mb-4 sm:mb-0">
          {/* Logo del Bar */}
          <img
            src="/logoBP.jpg"
            alt="Logo del Bar Pepin"
            className="w-10 h-10 sm:w-12 sm:h-12 object-contain rounded-3xl"
          />
          {/* Facebook */}
          <a
            href="https://www.facebook.com/people/Bar-Pepin/100064156744460/#"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook Bar Pepin"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg"
              alt="Logo de Facebook de Bar Pepin"
              className="w-8 h-8 hover:scale-110 transition-transform duration-200"
            />
          </a>
        </div>

        {/* Derecha: Texto */}
        <div className="text-center sm:text-right text-sm md:text-base text-gray-400">
          <p>
            &copy; {currentYear}{' '}
            <span className="font-semibold text-white">Bar Pepin</span>. Todos los derechos reservados.
          </p>
          <p className="italic mt-1">Hecho con ❤️ por el equipo de Bar Pepin</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
