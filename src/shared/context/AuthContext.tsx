import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { ListarFuncionarioDto } from '../types/Employee';
import AuthService from '../services/AuthService';
import EmployeeService from '../services/EmployeeService';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  employee: ListarFuncionarioDto | null;
  isAuthenticated: boolean;
  login: (email: string, senha: string) => Promise<boolean>;
  logout: () => void;
  loadingAuth: boolean;
  refreshEmployeeData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [employee, setEmployee] = useState<ListarFuncionarioDto | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loadingAuth, setLoadingAuth] = useState<boolean>(true);
  const navigate = useNavigate();

  const fetchEmployeeData = async (id: number) => {
    try {
      const employeeData = await EmployeeService.getEmployeeById(id);
      setEmployee(employeeData);
    } catch (error) {
      console.error('Erro ao buscar dados do funcionário:', error);
      // Se não conseguir buscar os dados, mantém apenas o ID
      setEmployee({ id } as ListarFuncionarioDto);
    }
  };

  const refreshEmployeeData = async () => {
    const storedId = localStorage.getItem('employeeId');
    if (storedId) {
      await fetchEmployeeData(parseInt(storedId));
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedId = localStorage.getItem('employeeId');
    
    if (storedToken && storedId) {
      setIsAuthenticated(true);
      fetchEmployeeData(parseInt(storedId));
    }
    setLoadingAuth(false);
  }, []);

  const login = async (email: string, senha: string): Promise<boolean> => {
    setLoadingAuth(true);
    try {
      const data = await AuthService.login(email, senha);
      if (data.token && data.id) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('employeeId', data.id.toString());
        
        // Buscar dados completos do funcionário
        await fetchEmployeeData(data.id);
        
        setIsAuthenticated(true);
        setLoadingAuth(false);
        return true;
      } else {
        throw new Error('Token ou ID não recebido.');
      }
    } catch (error: any) {
      setEmployee(null);
      setIsAuthenticated(false);
      localStorage.removeItem('token');
      localStorage.removeItem('employeeId');
      setLoadingAuth(false);
      return false;
    }
  };

  const logout = () => {
    setEmployee(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('employeeId');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ employee, isAuthenticated, login, logout, loadingAuth, refreshEmployeeData }}>
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