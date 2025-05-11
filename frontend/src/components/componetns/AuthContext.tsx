import React, {
  createContext,
  useState,
  useContext,
  useEffect,
} from 'react';

import type { ReactNode } from 'react'; 

// Tipo del contexto
interface AuthContextType {
  user: any;
  login: (userData: any, userRole: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  role: string | null;
}

// Props del proveedor
interface AuthProviderProps {
  children: ReactNode;
}

// Crear el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Proveedor del contexto
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedRole = localStorage.getItem('role');
    if (storedUser && storedRole) {
      setUser(JSON.parse(storedUser));
      setRole(storedRole);
      setIsAuthenticated(true);
    }
  }, []);

  const login = (userData: any, userRole: string) => {
    setUser(userData);
    setRole(userRole);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('role', userRole);
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('role');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, role }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
