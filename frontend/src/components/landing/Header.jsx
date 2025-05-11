import React from 'react';
import { useNavigate } from 'react-router-dom'; // Asegúrate de importar correctamente desde react-router-dom
import { FaHistory, FaCalendarAlt, FaImages, FaUtensils, FaComments, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa'; // Iconos para la navegación
import '../../App.css'; // Importamos el CSS global

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-black text-white py-4 shadow-md sticky top-0 w-full z-50 transition-all ease-in-out duration-300">
      <div className="container mx-auto flex justify-between items-center px-6 md:px-10 max-w-screen-lg">
        {/* Logo a la izquierda */}
        <div className="text-2xl font-bold">
          <img 
            src="/logo.png" 
            alt="Logo del Bar" 
            className="w-12 h-12 cursor-pointer" 
            onClick={() => navigate('/')} // Redirige a la página principal al hacer clic
          />
        </div>

        {/* Navegación centrada */}
        <nav className="flex justify-center items-center flex-grow">
          <ul className="flex gap-8 items-center text-center">
            <li>
              <button 
                onClick={() => navigate('/history')} 
                className="text-white hover:text-yellow-500 transition-all duration-300">
                <FaHistory /> Historia
              </button>
            </li>
            <li>
              <button 
                onClick={() => navigate('/events')} 
                className="text-white hover:text-yellow-500 transition-all duration-300">
                <FaCalendarAlt /> Eventos
              </button>
            </li>
            <li>
              <button 
                onClick={() => navigate('/gallery')} 
                className="text-white hover:text-yellow-500 transition-all duration-300">
                <FaImages /> Galería
              </button>
            </li>
            <li>
              <button 
                onClick={() => navigate('/menu')} 
                className="text-white hover:text-yellow-500 transition-all duration-300">
                <FaUtensils /> Menú
              </button>
            </li>
            <li>
              <button 
                onClick={() => navigate('/comments')} 
                className="text-white hover:text-yellow-500 transition-all duration-300">
                <FaComments /> Comentarios
              </button>
            </li>
          </ul>
        </nav>

        {/* Botones de Login y Registro */}
        <div className="flex gap-4 items-center">
          {/* Mostrar siempre los botones de Login y Registro */}
          <button
            className="bg-yellow-600 px-4 py-2 rounded-md text-white text-sm hover:bg-yellow-700 transition-all duration-300"
            onClick={() => navigate('/login')} // Redirige a /login cuando se hace clic en el botón
          >
            <FaSignInAlt /> Iniciar Sesión
          </button>

          <button
            className="bg-yellow-600 px-4 py-2 rounded-md text-white text-sm hover:bg-yellow-700 transition-all duration-300"
            onClick={() => navigate('/register')} // Redirige a /register cuando se hace clic en el botón
          >
            Registrarse
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
