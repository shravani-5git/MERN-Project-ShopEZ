import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('shopez_token');
    const savedUser = localStorage.getItem('shopez_user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  function persistSession(token, userData) {
    localStorage.setItem('shopez_token', token);
    localStorage.setItem('shopez_user', JSON.stringify(userData));
    setUser(userData);
  }

  async function login(email, password) {
    const { data } = await api.post('/auth/login', { email, password });
    persistSession(data.token, data.user);
    return data.user;
  }

  async function register(name, email, password) {
    const { data } = await api.post('/auth/register', { name, email, password });
    persistSession(data.token, data.user);
    return data.user;
  }

  function logout() {
    localStorage.removeItem('shopez_token');
    localStorage.removeItem('shopez_user');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
