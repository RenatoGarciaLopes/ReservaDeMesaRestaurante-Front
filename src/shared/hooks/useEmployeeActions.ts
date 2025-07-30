import { useState, useCallback } from 'react';
import EmployeeService from '../services/EmployeeService';
import type { ListarFuncionarioDto } from '../types/Employee';

interface UseEmployeeActionsReturn {
  selectedEmployee: ListarFuncionarioDto | null;
  anchorEl: HTMLElement | null;
  setSelectedEmployee: (employee: ListarFuncionarioDto | null) => void;
  setAnchorEl: (element: HTMLElement | null) => void;
  openActionsMenu: (event: React.MouseEvent<HTMLElement>, employee: ListarFuncionarioDto) => void;
  closeActionsMenu: () => void;
  toggleEmployeeStatus: () => Promise<void>;
  deleteEmployee: () => Promise<void>;
}

export const useEmployeeActions = (
  onSuccess: () => void,
  onError: (message: string) => void
): UseEmployeeActionsReturn => {
  const [selectedEmployee, setSelectedEmployee] = useState<ListarFuncionarioDto | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const openActionsMenu = useCallback((event: React.MouseEvent<HTMLElement>, employee: ListarFuncionarioDto) => {
    setAnchorEl(event.currentTarget);
    setSelectedEmployee(employee);
  }, []);

  const closeActionsMenu = useCallback(() => {
    setAnchorEl(null);
    setSelectedEmployee(null);
  }, []);

  const toggleEmployeeStatus = useCallback(async () => {
    if (!selectedEmployee) return;
    
    try {
      await EmployeeService.toggleEmployeeStatus(selectedEmployee.id, !selectedEmployee.ativo);
      onSuccess();
      closeActionsMenu();
    } catch (error: any) {
      onError(error.message || 'Erro ao alterar status do colaborador.');
    }
  }, [selectedEmployee, onSuccess, onError, closeActionsMenu]);

  const deleteEmployee = useCallback(async () => {
    if (!selectedEmployee) return;
    
    if (window.confirm(`Tem certeza que deseja excluir o colaborador ${selectedEmployee.nome}?`)) {
      try {
        await EmployeeService.deleteEmployee(selectedEmployee.id);
        onSuccess();
        closeActionsMenu();
      } catch (error: any) {
        onError(error.message || 'Erro ao excluir colaborador.');
      }
    }
  }, [selectedEmployee, onSuccess, onError, closeActionsMenu]);

  return {
    selectedEmployee,
    anchorEl,
    setSelectedEmployee,
    setAnchorEl,
    openActionsMenu,
    closeActionsMenu,
    toggleEmployeeStatus,
    deleteEmployee,
  };
}; 