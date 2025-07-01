import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
// Importe ListarFuncionarioDto diretamente
import type { ListarFuncionarioDto } from '../types/Employee';
import EmployeeService from '../services/EmployeeService';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  // Use ListarFuncionarioDto aqui
  employee: ListarFuncionarioDto | null;
  isAuthenticated: boolean;
  login: (cpf: string) => Promise<boolean>;
  logout: () => void;
  loadingAuth: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  // Use ListarFuncionarioDto aqui
  const [employee, setEmployee] = useState<ListarFuncionarioDto | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loadingAuth, setLoadingAuth] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmployee = localStorage.getItem('currentEmployee');

    if (storedEmployee) {
      try {
        // Parse para ListarFuncionarioDto
        const parsedEmployee: ListarFuncionarioDto = JSON.parse(storedEmployee);
        setEmployee(parsedEmployee);
        setIsAuthenticated(true);
      } catch (e) {
        console.error("Erro ao parsear dados do funcionário do localStorage", e);
        logout();
      }
    }
    setLoadingAuth(false);
  }, []);

  const login = async (cpf: string): Promise<boolean> => {
    setLoadingAuth(true);
    try {
      // EmployeeService.getEmployeeByCpf já retorna ListarFuncionarioDto
      const fetchedEmployee: ListarFuncionarioDto = await EmployeeService.getEmployeeByCpf(cpf);

      setEmployee(fetchedEmployee);
      setIsAuthenticated(true);
      localStorage.setItem('currentEmployee', JSON.stringify(fetchedEmployee));

      setLoadingAuth(false);
      return true;
    } catch (error) {
      console.error("Erro no 'login' por CPF:", error);
      setEmployee(null);
      setIsAuthenticated(false);
      localStorage.removeItem('currentEmployee');
      setLoadingAuth(false);
      return false;
    }
  };

  const logout = () => {
    setEmployee(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentEmployee');
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