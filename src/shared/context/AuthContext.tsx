import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
// Importe ListarFuncionarioDto diretamente

import AuthService from '../services/AuthService';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  employee: any | null; // Pode ser null ou apenas email
  isAuthenticated: boolean;
  login: (email: string, senha: string) => Promise<boolean>;
  logout: () => void;
  loadingAuth: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [employee, setEmployee] = useState<any | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loadingAuth, setLoadingAuth] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedEmail = localStorage.getItem('email');
    if (storedToken && storedEmail) {
      setEmployee({ email: storedEmail });
      setIsAuthenticated(true);
    }
    setLoadingAuth(false);
  }, []);

  const login = async (email: string, senha: string): Promise<boolean> => {
    setLoadingAuth(true);
    try {
      const data = await AuthService.login(email, senha);
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('email', email);
        setEmployee({ email });
        setIsAuthenticated(true);
        setLoadingAuth(false);
        return true;
      } else {
        throw new Error('Token não recebido.');
      }
    } catch (error: any) {
      setEmployee(null);
      setIsAuthenticated(false);
      localStorage.removeItem('token');
      localStorage.removeItem('email');
      setLoadingAuth(false);
      return false;
    }
  };

  const logout = () => {
    setEmployee(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ employee, isAuthenticated, login, logout, loadingAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};