import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  id_user: number;
  email: string;
  rol: string;
  exp: number;
  iat: number;
}

interface AuthContextType {
  user: DecodedToken | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  role: string | null;
  loading: boolean;  // Añadimos loading
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);  // Estado de carga

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('token');

      if (storedToken) {
        const decoded = jwtDecode<DecodedToken>(storedToken);
        const isExpired = decoded.exp * 1000 < Date.now();

        if (!isExpired) {
          setToken(storedToken);
          setUser(decoded);
          setIsAuthenticated(true);
        } else {
          logout(); // Token expirado
        }
      }
    } catch (error) {
      console.error('Error cargando datos de autenticación:', error);
      logout(); // Token o datos corruptos
    } finally {
      setLoading(false);  // Finalizamos el proceso de carga
    }
  }, []);  // Solo se ejecuta una vez al montar el componente.

  const login = (jwt: string) => {
    try {
      const decoded = jwtDecode<DecodedToken>(jwt);
      setToken(jwt);
      setUser(decoded);
      setIsAuthenticated(true);
      localStorage.setItem('token', jwt);
    } catch (error) {
      console.error('Error al decodificar el token:', error);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
  };

  const role = user?.rol || null;

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated, role, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
