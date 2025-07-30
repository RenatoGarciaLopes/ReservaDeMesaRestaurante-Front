import React, { useState, useCallback, useEffect } from 'react';
import EmployeeService from '../services/EmployeeService';
import type { ListarFuncionarioDto } from '../types/Employee';

type EmployeeFilterStatus = 'Ativos' | 'Inativos' | 'Todos';

interface UseEmployeesReturn {
  employees: ListarFuncionarioDto[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  pageSize: number;
  totalElements: number;
  filter: EmployeeFilterStatus;
  selectedEmployees: number[];
  setFilter: (filter: EmployeeFilterStatus) => void;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setSelectedEmployees: React.Dispatch<React.SetStateAction<number[]>>;
  fetchEmployees: () => Promise<void>;
  refreshEmployees: () => Promise<void>;
}

export const useEmployees = (): UseEmployeesReturn => {
  const [employees, setEmployees] = useState<ListarFuncionarioDto[]>([]);
  const [filter, setFilter] = useState<EmployeeFilterStatus>('Ativos');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      const ativo = filter === 'Ativos' ? true : filter === 'Inativos' ? false : undefined;
      const response = await EmployeeService.getEmployeesPaginated(currentPage, pageSize, ativo);
      
      if (!response || typeof response !== 'object') {
        throw new Error('Resposta da API inválida');
      }
      
      const content = Array.isArray(response.content) ? response.content : [];
      const totalElements = typeof response.totalElements === 'number' ? response.totalElements : 0;
      
      setEmployees(content);
      setTotalElements(totalElements);
      setError(null);
    } catch (err: any) {
      console.error("Erro ao buscar funcionários:", err);
      setError("Não foi possível carregar os funcionários. Verifique se o backend está rodando e tente recarregar a página.");
      setEmployees([]);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, filter]);

  const refreshEmployees = useCallback(async () => {
    await fetchEmployees();
  }, [fetchEmployees]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  return {
    employees,
    loading,
    error,
    currentPage,
    pageSize,
    totalElements,
    filter,
    selectedEmployees,
    setFilter,
    setCurrentPage,
    setPageSize,
    setSelectedEmployees,
    fetchEmployees,
    refreshEmployees,
  };
}; 