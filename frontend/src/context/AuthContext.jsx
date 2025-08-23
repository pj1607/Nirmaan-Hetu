import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from "react-hot-toast";

const AuthContext = createContext();
const API = import.meta.env.VITE_API_URL;

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(`${API}/auth/get-profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setIsLoggedIn(true);
        setUsername(data.username || '');
        setRole(data.role || '');

        localStorage.setItem('isLogin', 'true');
        localStorage.setItem('username', data.username);
        localStorage.setItem('role', data.role);
      } catch (err) {
        console.warn('Token invalid or expired', err.message);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const login = (token, username, role) => {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    localStorage.setItem('role', role);
    localStorage.setItem('isLogin', 'true');

    setIsLoggedIn(true);
    setUsername(username);
    setRole(role);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    localStorage.removeItem('isLogin');

    setIsLoggedIn(false);
    setUsername('');
    setRole('');

    toast.success('Logout successful!');
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        loading,
        login,
        logout,
        username,
        role,
        setUsername,
        setRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
