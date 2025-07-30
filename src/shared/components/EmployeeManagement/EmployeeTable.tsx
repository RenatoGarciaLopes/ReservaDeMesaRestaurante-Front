import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
} from '@mui/material';
import type { EmployeeTableProps } from './types';
import EmployeeTableHeader from './EmployeeTableHeader';
import EmployeeTableRow from './EmployeeTableRow';

const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  selectedEmployees,
  onSelectEmployee,
  onSelectAll,
  onOpenActionsMenu,
  currentPage,
  pageSize,
  totalElements,
  onPageChange,
  onPageSizeChange,
}) => {
  return (
    <Paper elevation={0} sx={{ 
      backgroundColor: 'white', 
      borderRadius: 2,
      border: '1px solid #e0e0e0',
      overflow: 'hidden'
    }}>
      <TableContainer>
        <Table>
          <EmployeeTableHeader
            employees={employees}
            selectedEmployees={selectedEmployees}
            onSelectAll={onSelectAll}
          />
          <TableBody>
            {employees?.map((employee, index) => (
              <EmployeeTableRow
                key={employee.id}
                employee={employee}
                index={index}
                isSelected={selectedEmployees.includes(employee.id)}
                onSelect={() => onSelectEmployee(employee.id)}
                onOpenActionsMenu={(e) => onOpenActionsMenu(e, employee)}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Paginação */}
      <TablePagination
        component="div"
        count={totalElements}
        page={currentPage}
        onPageChange={onPageChange}
        rowsPerPage={pageSize}
        onRowsPerPageChange={onPageSizeChange}
        labelRowsPerPage="Linhas por página"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        sx={{
          borderTop: '1px solid #f0f0f0',
          backgroundColor: '#fafafa',
          '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
            fontWeight: 600,
            color: '#495057'
          },
          '& .MuiTablePagination-actions': {
            '& .MuiIconButton-root': {
              backgroundColor: '#f8f9fa',
              '&:hover': {
                backgroundColor: '#e9ecef'
              }
            }
          }
        }}
      />
    </Paper>
  );
};

export default EmployeeTable; 