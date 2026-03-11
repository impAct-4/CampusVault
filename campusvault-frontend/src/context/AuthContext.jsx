import { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Check localStorage on mount to restore auth state
  useEffect(() => {
    try {
      const storedAuth = localStorage.getItem('campusvault_auth');
      if (storedAuth) {
        const authData = JSON.parse(storedAuth);
        setIsAuthenticated(true);
        setUser(authData);
      }
    } catch (error) {
      console.error('Error restoring auth state:', error);
      localStorage.removeItem('campusvault_auth');
    }
  }, []);

  const login = (email, password) => {
    // Simple mock validation
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    // Extract name from email (demo purposes)
    const name = email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1);

    const userData = { name, email };
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem('campusvault_auth', JSON.stringify(userData));
  };

  const register = (name, email, password) => {
    // Simple mock validation
    if (!name || !email || !password) {
      throw new Error('All fields are required');
    }

    const userData = { name, email };
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem('campusvault_auth', JSON.stringify(userData));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('campusvault_auth');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for consuming AuthContext
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
