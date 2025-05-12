import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';  // Importamos el hook para acceder al contexto

const PrivateRoute = ({ requiredRole = null }) => {
  const { isAuthenticated, role } = useAuth();  // Obtenemos el estado de autenticación y rol

  // Si no está autenticado, redirigimos al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si el rol no coincide, redirigimos a una página de acceso denegado o algo similar
  if (requiredRole && requiredRole !== role) {
    return <Navigate to="/access-denied" replace />;
  }

  return <Outlet />;  // Si todo es correcto, renderiza las rutas hijas
};

export default PrivateRoute;
