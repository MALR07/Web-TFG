// Footer (Pie de página con Facebook y derechos reservados)
const Footer = () => (
    <footer className="bg-gray-800 text-white py-4 mt-16">
      <div className="container mx-auto text-center">
        {/* Enlace a Facebook */}
        <div className="flex justify-center mb-4">
          <a
            href="https://www.facebook.com/tu-bar"  // Reemplaza con la URL de la cuenta de Facebook del bar
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 hover:text-blue-500"
          >
            {/* Ícono de Facebook */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6"
            >
              <path d="M18 2a2 2 0 0 1 2 2v18a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h12zm-6 12v-4H9V9h3V7a4 4 0 0 1 4-4h2v4h-2a2 2 0 0 0-2 2v2h4l-1 4h-3v8h-4v-8H9v-4h4V7h-1a1 1 0 0 0-1 1v2h-2z" />
            </svg>
            <span>Facebook</span>
          </a>
        </div>
  
        {/* Derechos reservados */}
        <p className="text-sm text-gray-400">© 2025 Restaurante Gourmet. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
    
  export default Footer;