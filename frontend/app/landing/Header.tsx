import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router'; // Importamos ambos: Link y useNavigate

const Header = () => {
  // Estado de autenticación (simulado)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // Usamos el hook useNavigate para redirigir
  const navigate = useNavigate();

  // Función para manejar el login/logout
  const handleLoginLogout = () => {
    if (isLoggedIn) {
      setIsLoggedIn(false); // Si está logueado, lo logueamos fuera
    } else {
      setIsLoggedIn(true); // Si no está logueado, lo logueamos
      navigate('../routes'); // Redirige a la página de login usando useNavigate
    }
  };

  return (
    <header className="bg-black text-white py-4 shadow-md sticky top-0 w-full z-50 transition-all ease-in-out duration-300">
      <div className="container mx-auto flex justify-between items-center px-6 md:px-10 max-w-screen-lg">
        {/* Logo a la izquierda */}
        <div className="text-2xl font-bold">
          <Link to="/" className="text-white hover:scale-110 transition-transform duration-300">
            <img src="/.png" alt="Logo del Bar" className="w-12 h-12" />
          </Link>
        </div>

        {/* Navegación centrada */}
        <nav className="flex justify-center items-center flex-grow">
          <ul className="flex gap-8 items-center text-center">
            <li>
              <Link to="/history" className="text-white hover:text-yellow-500 transition-all duration-300">
                Historia
              </Link>
            </li>
            <li>
              <Link to="/events" className="text-white hover:text-yellow-500 transition-all duration-300">
                Eventos
              </Link>
            </li>
            <li>
              <Link to="/gallery" className="text-white hover:text-yellow-500 transition-all duration-300">
                Galería
              </Link>
            </li>
            <li>
              <Link to="/menu" className="text-white hover:text-yellow-500 transition-all duration-300">
                Menú
              </Link>
            </li>
            <li>
              <Link to="/comments" className="text-white hover:text-yellow-500 transition-all duration-300">
                Comentarios
              </Link>
            </li>
          </ul>
        </nav>

        {/* Botones de Login, Registro y Reservar */}
        <div className="flex gap-4 items-center">
          {/* Si el usuario está logueado, mostrar "Reservar" y "Logout" */}
          {isLoggedIn ? (
            <>
              <button className="bg-yellow-600 px-4 py-2 rounded-md text-white text-sm hover:bg-yellow-700 transition-all duration-300">
                Reservar
              </button>
              <button
                className="bg-yellow-600 px-4 py-2 rounded-md text-white text-sm hover:bg-yellow-700 transition-all duration-300"
                onClick={handleLoginLogout} // Al hacer logout, cambia el estado
              >
                Salir
              </button>
            </>
          ) : (
            // Si el usuario no está logueado, mostrar "Login" y "Register"
            <>
              <button
                className="bg-yellow-600 px-4 py-2 rounded-md text-white text-sm hover:bg-yellow-700 transition-all duration-300"
                onClick={() => navigate('login.tsx')} // Redirige a /login cuando se hace clic en el botón
              >
                Iniciar Sesión
              </button>

              <button
                className="bg-yellow-600 px-4 py-2 rounded-md text-white text-sm hover:bg-yellow-700 transition-all duration-300"
                onClick={() => navigate('/register.tsx')} // Redirige a /register cuando se hace clic en el botón
              >
                Registrarse
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
