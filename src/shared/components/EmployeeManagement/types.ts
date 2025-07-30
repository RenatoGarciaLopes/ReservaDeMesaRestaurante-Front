import type { ListarFuncionarioDto } from '../../types/Employee';

export type EmployeeFilterStatus = 'Ativos' | 'Inativos' | 'Todos';

export interface EmployeeTableProps {
  employees: ListarFuncionarioDto[];
  selectedEmployees: number[];
  onSelectEmployee: (employeeId: number) => void;
  onSelectAll: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onOpenActionsMenu: (event: React.MouseEvent<HTMLElement>, employee: ListarFuncionarioDto) => void;
  currentPage: number;
  pageSize: number;
  totalElements: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onPageSizeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface EmployeeFiltersProps {
  filter: EmployeeFilterStatus;
  onFilterChange: (filter: EmployeeFilterStatus) => void;
  onAddEmployee: () => void;
}

export interface EmployeeTableRowProps {
  employee: ListarFuncionarioDto;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onOpenActionsMenu: (event: React.MouseEvent<HTMLElement>) => void;
}

export interface EmployeeTableHeaderProps {
  employees: ListarFuncionarioDto[];
  selectedEmployees: number[];
  onSelectAll: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface AddEmployeeModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: any) => Promise<void>;
}

export interface EmployeeActionsMenuProps {
  anchorEl: HTMLElement | null;
  selectedEmployee: ListarFuncionarioDto | null;
  onClose: () => void;
  onToggleStatus: () => Promise<void>;
  onDelete: () => Promise<void>;
} 