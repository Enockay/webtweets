import React, { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';

type AuthContextType = {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    // Initialize isAuthenticated from cookie or false if not found
    const isAuthenticatedCookie = Cookies.get('isAuthenticated');
    return isAuthenticatedCookie === 'true';
  });

  useEffect(() => {
    // Update cookie when isAuthenticated changes
    Cookies.set('isAuthenticated', isAuthenticated ? 'true' : 'false', { expires: 7 }); // Expires in 7 days
  }, [isAuthenticated]);

  const login = () => {
    setIsAuthenticated(true);
    // You may also set other cookies or tokens here for persistent authentication
  };

  const logout = () => {
    setIsAuthenticated(false);
    // Clear cookies or tokens here
    Cookies.remove('isAuthenticated');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
