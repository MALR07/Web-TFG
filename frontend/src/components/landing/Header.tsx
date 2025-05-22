import React, { useState, useEffect } from 'react';
import { useAuth } from '../componetns/AuthContext.tsx';
import { useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Usando alias para permitir la sintaxis con llaves
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

interface User {
  name: string;
  email: string;
}

const getUserFromToken = (): User | null => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;

    const decoded = jwtDecode<any>(token); // Decodificamos el token
    return {
      name: decoded.name || '', // Si no hay nombre, lo dejamos vacío
      email: decoded.email || '', // Siempre usamos el email
    };
  } catch (error) {
    console.error('Error al decodificar el token:', error);
    return null;
  }
};

const Header: React.FC = () => {
  const { isAuthenticated, logout, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Para obtener la URL actual
  const [showUserPanel, setShowUserPanel] = useState(false);
  const [userInfo, setUserInfo] = useState<User>({ name: '', email: '' });

  useEffect(() => {
    if (isAuthenticated) {
      const userData = getUserFromToken(); // Obtenemos los datos del usuario desde el token
      if (userData) setUserInfo(userData);
    } else {
      setUserInfo({ name: '', email: '' }); // En caso de que no esté autenticado, asignamos valores vacíos
    }
  }, [isAuthenticated]);

  const handleLoginLogout = () => {
    if (isAuthenticated) {
      logout();
      toast.success('Has cerrado sesión correctamente');
      setShowUserPanel(false);
      navigate('/');
    } else {
      navigate('/login');
    }
  };

  const toggleUserPanel = () => {
    setShowUserPanel((prev) => !prev);
  };

  const scrollOrNavigate = (sectionId: string) => {
    if (window.location.pathname === '/') {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/', { state: { scrollTo: sectionId } });
    }
  };

  const navButtonClass = 'bg-yellow-600 px-4 py-2 rounded-md hover:bg-yellow-700 transition-all duration-300 flex items-center gap-2 text-white';

  // Función para manejar el logo clickeado
  const handleLogoClick = () => {
    if (location.pathname === '/') {
      // Si estamos en la landing page, desplazamos a la parte superior
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Si no estamos en la landing, redirigimos al inicio de la landing
      navigate('/');
    }
  };

  return (
    <header className="bg-black text-white py-4 shadow-md sticky top-0 w-full z-50 transition-all ease-in-out duration-300 text-sm sm:text-base">
      <div className="container mx-auto flex flex-wrap justify-between items-center px-4 sm:px-6 md:px-10 max-w-screen-lg">
        <div
          className="text-2xl font-bold cursor-pointer mb-2 sm:mb-0"
          onClick={handleLogoClick} // Cambiamos el onClick para que ejecute la función que maneja el logo
        >
          <img src="/logoBP.jpg" alt="Logo del Bar" className="w-10 h-10 sm:w-12 sm:h-12 rounded-3xl" />
        </div>

        <nav className="flex-grow w-full sm:w-auto flex justify-center mt-2 sm:mt-0">
          <ul className="flex flex-wrap gap-4 sm:gap-6 justify-center text-white font-medium">
            <li>
              <span
                onClick={() => scrollOrNavigate('history')}
                className="cursor-pointer hover:text-yellow-500 transition-colors duration-300"
              >
                Historia
              </span>
            </li>
            <li>
              <span
                onClick={() => scrollOrNavigate('events')}
                className="cursor-pointer hover:text-yellow-500 transition-colors duration-300"
              >
                Eventos
              </span>
            </li>
            <li>
              <span
                onClick={() => scrollOrNavigate('gallery')}
                className="cursor-pointer hover:text-yellow-500 transition-colors duration-300"
              >
                Galería
              </span>
            </li>
            <li>
              <span
                onClick={() => scrollOrNavigate('menu')}
                className="cursor-pointer hover:text-yellow-500 transition-colors duration-300"
              >
                Menú
              </span>
            </li>
            <li>
              <span
                onClick={() => scrollOrNavigate('comments')}
                className="cursor-pointer hover:text-yellow-500 transition-colors duration-300"
              >
                Comentarios
              </span>
            </li>
          </ul>
        </nav>

        <div className="flex gap-4 mt-3 sm:mt-0 items-center w-full sm:w-auto justify-center sm:justify-end">
          {isAuthenticated ? (
            <div className="relative">
              {/* Ahora mostramos el nombre o el email */}
              <p className="text-white text-lg font-medium">Hola, {userInfo.name || userInfo.email || 'Usuario'}</p>
              <button
                onClick={toggleUserPanel}
                className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 transition-all duration-300 flex items-center gap-2"
              >
                {showUserPanel ? <FaChevronUp /> : <FaChevronDown />}
              </button>

              {/* Panel desplegable */}
              <div 
                className={`absolute top-12 right-0 bg-black text-white shadow-lg rounded-md w-64 p-4 z-50 transition-all duration-500 ease-in-out ${
                  showUserPanel ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}>
                <div className="space-y-3">
                  {/* Botones organizados dentro del desplegable */}
                  {role === 'cliente' && (
                    <>
                      <button
                        onClick={() => {
                          navigate('/reservations');
                          setShowUserPanel(false);
                        }}
                        className={navButtonClass}
                      >
                        Reservar
                      </button>
                      <button
                        onClick={() => {
                          navigate('/history-reservations');
                          setShowUserPanel(false);
                        }}
                        className={navButtonClass}
                      >
                        Historial de Reservas
                      </button>
                    </>
                  )}

                  {role === 'camarero' && (
                    <>
                      <button
                        onClick={() => {
                          navigate('/manage-reservations');
                          setShowUserPanel(false);
                        }}
                        className={navButtonClass}
                      >
                        Gestión Reservas
                      </button>
                      <button
                        onClick={() => {
                          navigate('/manage-dishes');
                          setShowUserPanel(false);
                        }}
                        className={navButtonClass}
                      >
                        Gestión Platos
                      </button>
                      <button
                        onClick={() => {
                          navigate('/manage-coments');
                          setShowUserPanel(false);
                        }}
                        className={navButtonClass}
                      >
                        Gestión Comentarios
                      </button>
                      <button
                        onClick={() => {
                          navigate('/manage-users');
                          setShowUserPanel(false);
                        }}
                        className={navButtonClass}
                      >
                        Gestión Usuarios <FaUsers />
                      </button>
                    </>
                  )}

                  {/* Botón de logout */}
                  <button onClick={handleLoginLogout} className={navButtonClass}>
                    Salir <FaSignOutAlt />
                  </button>
                </div>
              </div>
            </div>
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
