import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';  // Importamos el hook para acceder al contexto

// Componente PrivateRoute con soporte para múltiples roles
const PrivateRoute = ({ requiredRole = null }) => {
  const { isAuthenticated, role, loading } = useAuth();  // Obtenemos el estado de autenticación, rol y loading

  // Mientras se está verificando la autenticación, mostramos una pantalla de carga
  if (loading) {
    return <div></div>;  // Puedes reemplazar esto por un spinner o algo más adecuado
  }

  // Si el usuario no está autenticado, redirigimos a la página de login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si se requiere un rol específico, validamos si el rol del usuario es adecuado
  if (requiredRole) {
    // Si el rol requerido es un arreglo, verificamos si el rol del usuario está en el arreglo
    if (Array.isArray(requiredRole)) {
      if (!requiredRole.includes(role)) {
        return <Navigate to="/access-denied" replace />;
      }
    } else if (requiredRole !== role) {
      // Si el rol requerido no coincide con el rol del usuario
      return <Navigate to="/access-denied" replace />;
    }
  }

  // Si todo es correcto, renderiza las rutas hijas
  return <Outlet />;
};

export default PrivateRoute;
