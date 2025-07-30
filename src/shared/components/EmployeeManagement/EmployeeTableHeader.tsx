import React from 'react';
import {
  TableHead,
  TableRow,
  TableCell,
  Checkbox,
  Box,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
  Visibility as VisibilityIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import type { EmployeeTableHeaderProps } from './types';

const EmployeeTableHeader: React.FC<EmployeeTableHeaderProps> = ({
  employees,
  selectedEmployees,
  onSelectAll,
}) => {
  return (
    <TableHead>
      <TableRow sx={{ 
        backgroundColor: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        '& th': {
          borderBottom: '2px solid #dee2e6',
          fontWeight: 700,
          fontSize: '0.875rem',
          color: '#495057',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }
      }}>
        <TableCell padding="checkbox" sx={{ width: 50 }}>
          <Checkbox
            indeterminate={selectedEmployees.length > 0 && selectedEmployees.length < (employees?.length || 0)}
            checked={(employees?.length || 0) > 0 && selectedEmployees.length === (employees?.length || 0)}
            onChange={onSelectAll}
            sx={{
              '&.Mui-checked': {
                color: '#4caf50'
              }
            }}
          />
        </TableCell>
        <TableCell sx={{ fontWeight: 600 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PersonIcon sx={{ fontSize: 18, color: '#666' }} />
            Nome
          </Box>
        </TableCell>
        <TableCell sx={{ fontWeight: 600 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EmailIcon sx={{ fontSize: 18, color: '#666' }} />
            Email
          </Box>
        </TableCell>
        <TableCell sx={{ fontWeight: 600 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarIcon sx={{ fontSize: 18, color: '#666' }} />
            Data de cadastro
          </Box>
        </TableCell>
        <TableCell sx={{ fontWeight: 600 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <VisibilityIcon sx={{ fontSize: 18, color: '#666' }} />
            Status
          </Box>
        </TableCell>
        <TableCell sx={{ fontWeight: 600, width: 100 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SettingsIcon sx={{ fontSize: 18, color: '#666' }} />
            Ações
          </Box>
        </TableCell>
      </TableRow>
    </TableHead>
  );
};

export default EmployeeTableHeader; 