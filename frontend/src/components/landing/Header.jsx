import React from 'react';
import { useAuth } from '../../components/componetns/AuthContext.tsx';
import { useNavigate } from 'react-router-dom';
import { FaHistory, FaCalendarAlt, FaImages, FaUtensils, FaComments, FaSignInAlt, FaSignOutAlt, FaUsers } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../App.css'; // Asegúrate de que el archivo tenga la animación

const Header = () => {
  // Desestructuramos user, isAuthenticated y role desde el useAuth
  const { user, isAuthenticated, logout, role } = useAuth();
  const navigate = useNavigate();

  const handleLoginLogout = () => {
    if (isAuthenticated) {
      logout();
      toast.success('Has cerrado sesión correctamente');
      navigate('/');
    } else {
      navigate('/login');
    }
  };

  // Asegúrate de que el rol se recibe correctamente
  console.log("Rol del usuario:", role);  // Este es el log para verificar que se pasa correctamente el rol

  return (
    <header className="bg-black text-white py-4 shadow-md sticky top-0 w-full z-50 transition-all ease-in-out duration-300">
      <div className="container mx-auto flex justify-between items-center px-6 md:px-10 max-w-screen-lg">
        <div className="text-2xl font-bold cursor-pointer" onClick={() => navigate('/')}>
          <img src="/logo.png" alt="Logo del Bar" className="w-12 h-12" />
        </div>

        <nav className="flex-grow flex justify-center">
          <ul className="flex gap-6 items-center">
            <li>
              <button
                onClick={() => document.getElementById('history')?.scrollIntoView({ behavior: 'smooth' })}
                className="hover:text-yellow-500 transform transition-all duration-300 hover:translate-y-1"
              >
                <FaHistory className="text-xl" /> Historia
              </button>
            </li>
            <li>
              <button
                onClick={() => document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' })}
                className="hover:text-yellow-500 transform transition-all duration-300 hover:translate-y-1"
              >
                <FaCalendarAlt className="text-xl" /> Eventos
              </button>
            </li>
            <li>
              <button
                onClick={() => document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })}
                className="hover:text-yellow-500 transform transition-all duration-300 hover:translate-y-1"
              >
                <FaImages className="text-xl" /> Galería
              </button>
            </li>
            <li>
              <button
                onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}
                className="hover:text-yellow-500 transform transition-all duration-300 hover:translate-y-1"
              >
                <FaUtensils className="text-xl" /> Menú
              </button>
            </li>
            <li>
              <button
                onClick={() => document.getElementById('comments')?.scrollIntoView({ behavior: 'smooth' })}
                className="hover:text-yellow-500 transform transition-all duration-300 hover:translate-y-1"
              >
                <FaComments className="text-xl" /> Comentarios
              </button>
            </li>

            {/* Cliente: botón de Reservar */}
            {isAuthenticated && role === 'cliente' && (
              <li>
                <button
                  onClick={() => navigate('/reservations')}
                  className="hover:text-yellow-500 transform transition-all duration-300 hover:translate-y-1"
                >
                  Reservar
                </button>
              </li>
            )}

            {/* Camarero: botones de gestión */}
            {isAuthenticated && role === 'camarero' && (
              <>
                <li>
                  <button
                    onClick={() => navigate('/manage-reservations')}
                    className="hover:text-yellow-500 transform transition-all duration-300 hover:translate-y-1"
                  >
                    Gestión Reservas
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/manage-dishes')}
                    className="hover:text-yellow-500 transform transition-all duration-300 hover:translate-y-1"
                  >
                    Gestión Platos
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/manage-users')}
                    className="hover:text-yellow-500 transform transition-all duration-300 hover:translate-y-1"
                  >
                    <FaUsers className="text-xl" /> Gestión Usuarios
                  </button>
                </li>
              </>
            )}
          </ul>
        </nav>

        {/* Botones Login / Logout */}
        <div className="flex gap-3 items-center">
          {isAuthenticated ? (
            <button
              onClick={handleLoginLogout}
              className="bg-yellow-600 px-4 py-2 rounded-md hover:bg-yellow-700"
            >
              <FaSignOutAlt /> Salir
            </button>
          ) : (
            <div>
              <button
                onClick={() => navigate('/login')}
                className="bg-yellow-600 px-4 py-2 rounded-md hover:bg-yellow-700"
              >
                <FaSignInAlt /> Iniciar Sesión
              </button>
              <button
                onClick={() => navigate('/register')}
                className="bg-yellow-600 px-4 py-2 rounded-md hover:bg-yellow-700"
              >
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
