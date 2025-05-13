import React, { useState } from 'react';
import { useAuth } from '../../components/componetns/AuthContext.tsx';
import { useNavigate } from 'react-router-dom';
import {
  FaSignInAlt,
  FaSignOutAlt,
  FaUsers,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../App.css';

const Header = () => {
  const { isAuthenticated, logout, role, user } = useAuth();
  const navigate = useNavigate();

  // Estado para manejar la visibilidad del panel de usuario
  const [showUserPanel, setShowUserPanel] = useState(false);

  // Función para manejar login/logout
  const handleLoginLogout = () => {
    if (isAuthenticated) {
      logout();
      toast.success('Has cerrado sesión correctamente');
      setShowUserPanel(false); // Cierra el panel al hacer logout
      navigate('/');
    } else {
      navigate('/login');
    }
  };

  // Alternar la visibilidad del panel de usuario
  const toggleUserPanel = () => {
    setShowUserPanel((prev) => !prev);
  };

  const navButtonClass =
    'bg-yellow-600 px-4 py-2 rounded-md hover:bg-yellow-700 transition-all duration-300 flex items-center gap-2 text-white';

  return (
    <header className="bg-black text-white py-4 shadow-md sticky top-0 w-full z-50 transition-all ease-in-out duration-300 text-sm sm:text-base">
      <div className="container mx-auto flex flex-wrap justify-between items-center px-4 sm:px-6 md:px-10 max-w-screen-lg">
        <div
          className="text-2xl font-bold cursor-pointer mb-2 sm:mb-0"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          {/* Logo del Bar */}
          <img src="/logo.png" alt="Logo del Bar" className="w-10 h-10 sm:w-12 sm:h-12" />
        </div>

        {/* Enlaces del Landing (solo texto blanco con hover) */}
        <nav className="flex-grow w-full sm:w-auto flex justify-center mt-2 sm:mt-0">
          <ul className="flex flex-wrap gap-4 sm:gap-6 justify-center text-white font-medium">
            <li>
              <span
                onClick={() => document.getElementById('history')?.scrollIntoView({ behavior: 'smooth' })}
                className="cursor-pointer hover:text-yellow-500 transition-colors duration-300"
              >
                Historia
              </span>
            </li>
            <li>
              <span
                onClick={() => document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' })}
                className="cursor-pointer hover:text-yellow-500 transition-colors duration-300"
              >
                Eventos
              </span>
            </li>
            <li>
              <span
                onClick={() => document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })}
                className="cursor-pointer hover:text-yellow-500 transition-colors duration-300"
              >
                Galería
              </span>
            </li>
            <li>
              <span
                onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}
                className="cursor-pointer hover:text-yellow-500 transition-colors duration-300"
              >
                Menú
              </span>
            </li>
            <li>
              <span
                onClick={() => document.getElementById('comments')?.scrollIntoView({ behavior: 'smooth' })}
                className="cursor-pointer hover:text-yellow-500 transition-colors duration-300"
              >
                Comentarios
              </span>
            </li>
          </ul>
        </nav>

        {/* Área para Login, Registro y Usuario */}
        <div className="flex gap-4 mt-3 sm:mt-0 items-center w-full sm:w-auto justify-center sm:justify-end">
          {isAuthenticated ? (
            <>
              {/* Mensaje de bienvenida y panel de usuario */}
              <div className="relative">
                <p className="text-white">Hola, {user?.name}</p>

                {/* Botón para mostrar/ocultar el panel */}
                <button
                  onClick={toggleUserPanel}
                  className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 transition-all duration-300 flex items-center gap-2"
                >
                  {showUserPanel ? (
                    <FaChevronUp className="text-white" />
                  ) : (
                    <FaChevronDown className="text-white" />
                  )}
                </button>

                {/* Panel de usuario deslizable */}
                <div
                  className={`absolute top-12 right-0 bg-black text-white shadow-lg rounded-md w-64 p-4 transition-transform duration-300 ease-in-out transform ${
                    showUserPanel ? 'translate-x-0' : 'translate-x-full'
                  }`}
                >
                  <p className="mb-2">Bienvenido, {user?.name}!</p>

                  {/* Botones según el rol */}
                  {role === 'cliente' && (
                    <button onClick={() => navigate('/reservations')} className={navButtonClass}>
                      Reservar
                    </button>
                  )}
                  {role === 'camarero' && (
                    <>
                      <button onClick={() => navigate('/manage-reservations')} className={navButtonClass}>
                        Gestión Reservas
                      </button>
                      <button onClick={() => navigate('/manage-dishes')} className={navButtonClass}>
                        Gestión Platos
                      </button>
                      <button onClick={() => navigate('/manage-users')} className={navButtonClass}>
                        Gestión Usuarios <FaUsers />
                      </button>
                    </>
                  )}

                  {/* Botón para cerrar sesión */}
                  <button onClick={handleLoginLogout} className={navButtonClass}>
                    Salir <FaSignOutAlt />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <button onClick={() => navigate('/login')} className={navButtonClass}>
                Iniciar Sesión <FaSignInAlt />
              </button>
              <button onClick={() => navigate('/register')} className={navButtonClass}>
                Registrarse
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
