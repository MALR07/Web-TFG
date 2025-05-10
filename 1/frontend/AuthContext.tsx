import React, { createContext, useState, useContext, useEffect } from 'react';

// Tipo para definir el contexto de autenticación
interface AuthContextType {
  user: any; // Aquí puedes especificar el tipo de datos del usuario
  login: (userData: any) => void; // Función para login
  logout: () => void; // Función para logout
  isAuthenticated: boolean; // Si el usuario está autenticado o no
}

// Crear el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Proveedor del contexto para envolver la aplicación
export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<any>(null); // Estado para el usuario
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false); // Estado para saber si está autenticado

  // Comprobar si el usuario ya está logueado al cargar la página (se puede usar localStorage o cookies)
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  // Función para login
  const login = (userData: any) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userData)); // Guardar el usuario en localStorage
  };

  // Función para logout
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user'); // Eliminar el usuario de localStorage
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
