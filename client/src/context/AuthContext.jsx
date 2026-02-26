import { createContext, useContext, useState } from 'react';
import { login as loginApi, register as registerApi } from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [customer, setCustomer] = useState(() => {
    const stored = localStorage.getItem('customer');
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (username, password) => {
    const { data } = await loginApi(username, password);
    localStorage.setItem('token', data.token);
    localStorage.setItem('customer', JSON.stringify(data.customer));
    setToken(data.token);
    setCustomer(data.customer);
  };

  const register = async (fields) => {
    await registerApi(fields);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('customer');
    setToken(null);
    setCustomer(null);
  };

  return (
    <AuthContext.Provider value={{ token, customer, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
