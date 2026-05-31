import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('smartpt_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        { email, password }
      );
      const loggedUser = response.data.user;
      setUser(loggedUser);
      localStorage.setItem('smartpt_user', JSON.stringify(loggedUser));
      return { success: true, user: loggedUser };
    } catch (err) {
      console.error(err);
      return {
        success: false,
        error: err.response?.data?.message || 'Login failed. Please check your credentials.'
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        userData
      );
      return { success: true, message: response.data.message };
    } catch (err) {
      console.error(err);
      return {
        success: false,
        error: err.response?.data?.error || err.response?.data?.message || 'Registration failed'
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/logout`);
    } catch (err) {
      console.error("Logout request error", err);
    } finally {
      setUser(null);
      localStorage.removeItem('smartpt_user');
    }
  };

  const updateUserProfile = async (updatedFields) => {
    if (!user) return { success: false, error: 'No authenticated user' };
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/auth/${user._id}`,
        updatedFields
      );
      const updatedUser = response.data.payload;
      setUser(updatedUser);
      localStorage.setItem('smartpt_user', JSON.stringify(updatedUser));
      return { success: true, user: updatedUser };
    } catch (err) {
      console.error(err);
      return {
        success: false,
        error: err.response?.data?.message || 'Failed to update profile'
      };
    }
  };

  const uploadResume = async (formData) => {
    if (!user) return { success: false, error: 'No authenticated user' };
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/auth/upload-resume`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );
      const updatedUser = response.data.payload;
      setUser(updatedUser);
      localStorage.setItem('smartpt_user', JSON.stringify(updatedUser));
      return { success: true, user: updatedUser };
    } catch (err) {
      console.error(err);
      return {
        success: false,
        error: err.response?.data?.message || 'Failed to upload resume'
      };
    }
  };

  // Add interceptor to handle session expiration (401 errors)
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          // Token expired or unauthorized - log out locally
          setUser(null);
          localStorage.removeItem('smartpt_user');
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        login,
        register,
        logout,
        updateUserProfile,
        uploadResume
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};