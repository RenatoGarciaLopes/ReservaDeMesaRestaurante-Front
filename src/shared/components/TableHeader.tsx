import React from 'react';
import { AppBar, Toolbar, Typography, Select, MenuItem, FormControl, InputLabel, Box } from '@mui/material';
import type { SortOption, TableStatus } from '../types/Table';



interface TableHeaderProps {
  currentFilter: TableStatus;
  onFilterChange: (filter: TableStatus) => void;
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const TableHeader: React.FC<TableHeaderProps> = ({ currentFilter, onFilterChange, currentSort, onSortChange }) => {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#f5f5f5', color: '#333', boxShadow: 'none', borderBottom: '1px solid #ddd' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#333' }}>
          Gerenciamento de Mesas
        </Typography>
        <Box sx={{ minWidth: 120, marginRight: 2 }}>
          <FormControl fullWidth size="small">
            <InputLabel id="filter-label">Mostrar:</InputLabel>
            <Select
              labelId="filter-label"
              id="filter-select"
              value={currentFilter}
              label="Mostrar"
              onChange={(e) => onFilterChange(e.target.value as TableStatus)}
              sx={{ '.MuiSelect-select': { paddingRight: '32px !important' } }}
            >
              <MenuItem value="Todos">Todos</MenuItem>
              <MenuItem value="Livre">Livre</MenuItem>
              <MenuItem value="Ocupada">Ocupada</MenuItem>
              <MenuItem value="Reservada">Reservada</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ minWidth: 150 }}>
          <FormControl fullWidth size="small">
            <InputLabel id="sort-label">Ordenar por:</InputLabel>
            <Select
              labelId="sort-label"
              id="sort-select"
              value={currentSort}
              label="Ordenar por"
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              sx={{ '.MuiSelect-select': { paddingRight: '32px !important' } }}
            >
              <MenuItem value="number">Nº mesa</MenuItem>
              <MenuItem value="status">Status</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TableHeader;