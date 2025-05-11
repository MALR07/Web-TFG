const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white text-center py-6 mt-12">
      <p className="text-sm md:text-base text-gray-400">
        &copy; 2025 <span className="font-semibold text-white">Bar Pepin</span>. Todos los derechos reservados.
      </p>
      <div className="mt-1 text-sm text-gray-400 italic">
        Hecho con ❤️ por el equipo de Bar Pepin
      </div>
      <div className="mt-4">
        <a
          href="https://www.facebook.com/people/Bar-Pepin/100064156744460/#"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg"
            alt="Facebook"
            className="w-8 h-8 mx-auto hover:scale-110 transition-transform duration-200"
          />
        </a>
      </div>
    </footer>
  );
};

export default Footer;