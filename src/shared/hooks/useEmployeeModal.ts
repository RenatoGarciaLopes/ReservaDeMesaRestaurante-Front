import { useState, useCallback } from 'react';
import EmployeeService from '../services/EmployeeService';
import type { Cargo } from '../types/Employee';

interface UseEmployeeModalReturn {
  openAddEmployeeModal: boolean;
  openAddEmployeeModalHandler: () => void;
  closeAddEmployeeModalHandler: () => void;
  createEmployee: (employeeData: {
    nome: string;
    email: string;
    telefone: string;
    cargo: Cargo;
    cpf: string;
    senha: string;
  }) => Promise<void>;
}

export const useEmployeeModal = (
  onSuccess: () => void,
  onError: (message: string) => void
): UseEmployeeModalReturn => {
  const [openAddEmployeeModal, setOpenAddEmployeeModal] = useState(false);

  const openAddEmployeeModalHandler = useCallback(() => {
    setOpenAddEmployeeModal(true);
  }, []);

  const closeAddEmployeeModalHandler = useCallback(() => {
    setOpenAddEmployeeModal(false);
  }, []);

  const createEmployee = useCallback(async (employeeData: {
    nome: string;
    email: string;
    telefone: string;
    cargo: Cargo;
    cpf: string;
    senha: string;
  }) => {
    try {
      await EmployeeService.createEmployee(employeeData);
      onSuccess();
      closeAddEmployeeModalHandler();
    } catch (error: any) {
      onError(error.message || 'Erro ao criar colaborador.');
    }
  }, [onSuccess, onError, closeAddEmployeeModalHandler]);

  return {
    openAddEmployeeModal,
    openAddEmployeeModalHandler,
    closeAddEmployeeModalHandler,
    createEmployee,
  };
}; 