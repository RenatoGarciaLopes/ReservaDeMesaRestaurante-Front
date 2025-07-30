import React, { useEffect } from 'react';
import {
  Container,
  Box,
  CircularProgress,
  Typography,
  AppBar,
  Toolbar,
  Button,
} from '@mui/material';
import { useAuth } from '../shared/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import NavigationBreadcrumb from '../shared/components/NavigationBreadcrumb';
import UserAvatar from '../shared/components/UserAvatar';

// Hooks
import { useEmployees } from '../shared/hooks/useEmployees';
import { useEmployeeActions } from '../shared/hooks/useEmployeeActions';
import { useEmployeeModal } from '../shared/hooks/useEmployeeModal';
import { useSnackbar } from '../shared/hooks/useSnackbar';

// Componentes
import {
  EmployeeTable,
  EmployeeFilters,
  AddEmployeeModal,
  EmployeeActionsMenu,
  EmployeeSnackbar,
} from '../shared/components/EmployeeManagement';

function EmployeesPage() {
  const { employee } = useAuth();
  const navigate = useNavigate();
  
  // Hooks
  const {
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
  } = useEmployees();

  const { snackbar, showSuccess, showError, closeSnackbar } = useSnackbar();

  const {
    selectedEmployee,
    anchorEl,
    openActionsMenu,
    closeActionsMenu,
    toggleEmployeeStatus,
    deleteEmployee,
  } = useEmployeeActions(
    () => {
      showSuccess('Operação realizada com sucesso!');
      fetchEmployees();
    },
    showError
  );

  const {
    openAddEmployeeModal,
    openAddEmployeeModalHandler,
    closeAddEmployeeModalHandler,
    createEmployee,
  } = useEmployeeModal(
    () => {
      showSuccess('Colaborador criado com sucesso!');
      fetchEmployees();
    },
    showError
  );

  // Verificar se o usuário é gerente
  useEffect(() => {
    if (employee && employee.cargo !== 'GERENTE') {
      navigate('/tables');
    }
  }, [employee, navigate]);

  const handleFilterChange = (newFilter: 'Ativos' | 'Inativos' | 'Todos') => {
    setFilter(newFilter);
    setCurrentPage(0);
  };

  const handlePageChange = (event: unknown, newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleChangePageSize = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPageSize(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedEmployees(employees.map(emp => emp.id));
    } else {
      setSelectedEmployees([]);
    }
  };

  const handleSelectEmployee = (employeeId: number) => {
    setSelectedEmployees(prev => 
      prev.includes(employeeId) 
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const handleOpenActionsMenu = (event: React.MouseEvent<HTMLElement>, employee: any) => {
    openActionsMenu(event, employee);
  };

  const handleCreateNewEmployee = async () => {
    // Esta função será chamada pelo modal quando o usuário confirmar
    // O modal já tem acesso aos dados do formulário através do hook useEmployeeForm
    await createEmployee({
      nome: '', // Será preenchido pelo modal
      email: '',
      telefone: '',
      cargo: 'GARCOM' as any,
      cpf: '',
      senha: '',
    });
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        gap: 2
      }}>
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary">
          Carregando colaboradores...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', 
        gap: 2,
        p: 3
      }}>
        <Typography variant="h5" color="error" gutterBottom>
          Erro ao carregar colaboradores
        </Typography>
        <Typography variant="body1" color="text.secondary" textAlign="center">
          {error}
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => window.location.reload()}
          sx={{ mt: 2 }}
        >
          Tentar novamente
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Header Principal */}
      <AppBar position="static" elevation={0} sx={{ 
        backgroundColor: 'white', 
        borderBottom: '1px solid #e0e0e0'
      }}>
        <Toolbar>
          <Typography variant="h4" component="h1"
            sx={{ 
              flexGrow: 1,
              color: '#1a1a1a',
              fontWeight: 600,
              fontSize: { xs: '1.5rem', sm: '2rem' }
            }}>
            Gerenciar Colaboradores
          </Typography>
          <UserAvatar onOpenSettings={() => {}} />
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 3 }}>
        <NavigationBreadcrumb />
        
        {/* Filtros */}
        <EmployeeFilters
          filter={filter}
          onFilterChange={handleFilterChange}
          onAddEmployee={openAddEmployeeModalHandler}
        />

        {/* Tabela de Funcionários */}
        <EmployeeTable
          employees={employees}
          selectedEmployees={selectedEmployees}
          onSelectEmployee={handleSelectEmployee}
          onSelectAll={handleSelectAll}
          onOpenActionsMenu={handleOpenActionsMenu}
          currentPage={currentPage}
          pageSize={pageSize}
          totalElements={totalElements}
          onPageChange={handlePageChange}
          onPageSizeChange={handleChangePageSize}
        />
      </Container>

      {/* Modal Novo Funcionário */}
      <AddEmployeeModal
        open={openAddEmployeeModal}
        onClose={closeAddEmployeeModalHandler}
        onSubmit={handleCreateNewEmployee}
      />

      {/* Menu de Ações */}
      <EmployeeActionsMenu
        anchorEl={anchorEl}
        selectedEmployee={selectedEmployee}
        onClose={closeActionsMenu}
        onToggleStatus={toggleEmployeeStatus}
        onDelete={deleteEmployee}
      />

      {/* Snackbar para mensagens */}
      <EmployeeSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={closeSnackbar}
      />
    </Box>
  );
}

export default EmployeesPage; 