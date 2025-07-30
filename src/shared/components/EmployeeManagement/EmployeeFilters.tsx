import React from 'react';
import {
  Paper,
  Box,
  Button,
  Typography,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  FilterList as FilterListIcon,
} from '@mui/icons-material';
import type { EmployeeFiltersProps } from './types';

const EmployeeFilters: React.FC<EmployeeFiltersProps> = ({
  filter,
  onFilterChange,
  onAddEmployee,
}) => {
  return (
    <Paper elevation={0} sx={{ 
      p: 2, 
      mb: 3, 
      backgroundColor: 'white', 
      borderRadius: 2,
      border: '1px solid #e0e0e0'
    }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Filtros */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            backgroundColor: '#f8f9fa',
            px: 2,
            py: 1,
            borderRadius: 2
          }}>
            <FilterListIcon sx={{ color: '#666', fontSize: 20 }} />
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
              Filtros:
            </Typography>
          </Box>
          <Chip
            label="Ativos"
            onClick={() => onFilterChange('Ativos')}
            color={filter === 'Ativos' ? 'success' : 'default'}
            variant={filter === 'Ativos' ? 'filled' : 'outlined'}
            size="medium"
            sx={{ 
              fontWeight: 600,
              '&.MuiChip-filled': {
                backgroundColor: '#4caf50',
                color: 'white'
              }
            }}
          />
          <Chip
            label="Inativos"
            onClick={() => onFilterChange('Inativos')}
            color={filter === 'Inativos' ? 'error' : 'default'}
            variant={filter === 'Inativos' ? 'filled' : 'outlined'}
            size="medium"
            sx={{ 
              fontWeight: 600,
              '&.MuiChip-filled': {
                backgroundColor: '#f44336',
                color: 'white'
              }
            }}
          />
          <Chip
            label="Todos"
            onClick={() => onFilterChange('Todos')}
            color={filter === 'Todos' ? 'primary' : 'default'}
            variant={filter === 'Todos' ? 'filled' : 'outlined'}
            size="medium"
            sx={{ fontWeight: 600 }}
          />
        </Box>
        
        {/* Botão Novo Colaborador */}
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAddEmployee}
        >
          Novo Colaborador
        </Button>
      </Box>
    </Paper>
  );
};

export default EmployeeFilters; 