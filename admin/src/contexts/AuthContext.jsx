import { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const userData = localStorage.getItem('admin_user');
    const accessToken = localStorage.getItem('admin_access_token');
    
    if (userData && accessToken) {
      const parsedUser = JSON.parse(userData);
      // Verify user is admin
      if (parsedUser.role === 'admin') {
        setUser(parsedUser);
      } else {
        // Not an admin, clear storage
        localStorage.removeItem('admin_access_token');
        localStorage.removeItem('admin_refresh_token');
        localStorage.removeItem('admin_user');
      }
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);

      if (response.success) {
        const { accessToken, refreshToken, user } = response.data;
        
        // Verify user is admin
        if (user.role !== 'admin') {
          throw new Error('Access denied. Admin role required.');
        }

        localStorage.setItem('admin_access_token', accessToken);
        localStorage.setItem('admin_refresh_token', refreshToken);
        localStorage.setItem('admin_user', JSON.stringify(user));
        setUser(user);
      }

      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('admin_refresh_token');
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('admin_access_token');
      localStorage.removeItem('admin_refresh_token');
      localStorage.removeItem('admin_user');
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user && user.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
