import React from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../all/AuthContext'; 

const Header = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-black text-white py-4 shadow-md sticky top-0 w-full z-50">
      <div className="container mx-auto flex justify-between items-center px-6 md:px-10 max-w-screen-lg">
        <Link to="/" className="text-white text-2xl font-bold">
          <img src="/logo.png" alt="Logo" className="w-12 h-12" />
        </Link>

        <nav>
          <ul className="flex gap-6">
            <li><Link to="/history">Historia</Link></li>
            <li><Link to="/events">Eventos</Link></li>
            <li><Link to="/gallery">Galería</Link></li>
            <li><Link to="/menu">Menú</Link></li>
            <li><Link to="/comments">Comentarios</Link></li>
          </ul>
        </nav>

        <div className="flex gap-4">
          {isAuthenticated ? (
            <>
              <button onClick={() => navigate('/reservas')} className="bg-yellow-600 px-4 py-2 rounded-md text-white hover:bg-yellow-700">Reservar</button>
              <button onClick={logout} className="bg-yellow-600 px-4 py-2 rounded-md text-white hover:bg-yellow-700">Salir</button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/login')} className="bg-yellow-600 px-4 py-2 rounded-md text-white hover:bg-yellow-700">Iniciar Sesión</button>
              <button onClick={() => navigate('/register')} className="bg-yellow-600 px-4 py-2 rounded-md text-white hover:bg-yellow-700">Registrarse</button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
