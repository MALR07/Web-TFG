import React from 'react';
import { useNavigate } from 'react-router'; // Usamos useNavigate para la navegación
import { useAuth } from '../all/AuthContext'; // Usamos el contexto de autenticación
import { toast } from 'react-toastify'; // Importamos react-toastify
import { FaHistory, FaCalendarAlt, FaImages, FaUtensils, FaComments, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa'; // Iconos para la navegación
import '../app.css'; // Importamos el CSS global

// Asegúrate de que react-toastify está configurado en tu proyecto
import 'react-toastify/dist/ReactToastify.css';

const Header = () => {
  // Accedemos a la información del usuario y su rol desde el contexto
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  // Función para manejar el login/logout
  const handleLoginLogout = () => {
    if (isAuthenticated) {
      logout(); // Llamamos al método logout del contexto
      toast.success('Has cerrado sesión correctamente'); // Notificación de éxito
      navigate('/'); // Redirige a la página principal
    } else {
      navigate('/login'); // Redirige a la página de login
    }
  };

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
            {/* Mostrar el botón de "Reservar" solo si el usuario está logueado */}
            {isAuthenticated && user?.role === 'user' && (
              <li>
                <button 
                  onClick={() => navigate('/reservations')} 
                  className="text-white hover:text-yellow-500 transition-all duration-300">
                  Reservar
                </button>
              </li>
            )}
            {/* Mostrar botones de gestión solo si el usuario es camarero */}
            {isAuthenticated && user?.role === 'camarero' && (
              <>
                <li>
                  <button 
                    onClick={() => navigate('/manage-reservations')} 
                    className="text-white hover:text-yellow-500 transition-all duration-300">
                    Gestión de Reservas
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigate('/manage-dishes')} 
                    className="text-white hover:text-yellow-500 transition-all duration-300">
                    Gestión de Platos
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigate('/manage-users')} 
                    className="text-white hover:text-yellow-500 transition-all duration-300">
                    Gestión de Usuarios
                  </button>
                </li>
              </>
            )}
          </ul>
        </nav>

        {/* Botones de Login, Registro y Logout */}
        <div className="flex gap-4 items-center">
          {/* Si el usuario está logueado, mostrar "Logout" */}
          {isAuthenticated ? (
            <>
              <button
                className="bg-yellow-600 px-4 py-2 rounded-md text-white text-sm hover:bg-yellow-700 transition-all duration-300"
                onClick={handleLoginLogout} // Al hacer logout, cambia el estado
              >
                <FaSignOutAlt /> Salir
              </button>
            </>
          ) : (
            // Si el usuario no está logueado, mostrar "Login" y "Register"
            <>
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
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
