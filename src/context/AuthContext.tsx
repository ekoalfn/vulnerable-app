import React, { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { mockAPI } from '../mockBackend';

// Define the shape of our context
interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: any) => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
}

// Create context with a default value
export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  updateProfile: async () => {},
  changePassword: async () => {},
});

// API base URL - Not used directly now, but kept for reference
const API_URL = 'http://localhost:5000/api';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check for token in localStorage on mount
    const token = localStorage.getItem('authToken');
    if (token) {
      // Set auth token header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Fetch user data from mock API
      const fetchUser = async () => {
        try {
          const userData = await mockAPI.auth.getUser();
          setUser(userData);
          setIsAuthenticated(true);
        } catch (err) {
          // If token is invalid, clear localStorage
          localStorage.removeItem('authToken');
          delete axios.defaults.headers.common['Authorization'];
        } finally {
          setLoading(false);
        }
      };

      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  // Login user
  const login = async (email: string, password: string) => {
    try {
      const response = await mockAPI.auth.login(email, password);
      // Store token in localStorage (vulnerable to XSS)
      localStorage.setItem('authToken', response.token);
      // Set auth token header
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.token}`;
      // Fetch user data
      const userData = await mockAPI.auth.getUser();
      setUser(userData);
      setIsAuthenticated(true);
    } catch (err) {
      throw err;
    }
  };

  // Register user
  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await mockAPI.auth.register(name, email, password);
      // Store token in localStorage (vulnerable to XSS)
      localStorage.setItem('authToken', response.token);
      // Set auth token header
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.token}`;
      // Fetch user data
      const userData = await mockAPI.auth.getUser();
      setUser(userData);
      setIsAuthenticated(true);
    } catch (err) {
      throw err;
    }
  };

  // Logout user
  const logout = () => {
    // Remove token from localStorage
    localStorage.removeItem('authToken');
    // Remove auth header
    delete axios.defaults.headers.common['Authorization'];
    // Reset state
    setUser(null);
    setIsAuthenticated(false);
  };

  // Update profile
  const updateProfile = async (data: any) => {
    try {
      const updatedUser = await mockAPI.users.updateProfile(data);
      setUser({ ...user, ...updatedUser });
    } catch (err) {
      throw err;
    }
  };

  // Change password
  const changePassword = async (oldPassword: string, newPassword: string) => {
    try {
      await mockAPI.users.changePassword(oldPassword, newPassword);
      // No CSRF protection is implemented here
    } catch (err) {
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      loading,
      login,
      register,
      logout,
      updateProfile,
      changePassword
    }}>
      {children}
    </AuthContext.Provider>
  );
}; 