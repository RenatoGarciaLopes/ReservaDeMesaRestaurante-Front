import React from 'react';
import { AppBar, Toolbar, Typography, Select, MenuItem, FormControl, InputLabel, Box, IconButton } from '@mui/material'; // Adicione IconButton
import SettingsIcon from '@mui/icons-material/Settings'; // Adicione esta importação
import type { SortOption, TableFilterStatus } from '../types/Table'; // Remova TableStatusType se não for mais usado aqui


interface TableHeaderProps {
  currentFilter: TableFilterStatus;
  // AQUI: Corrigido o tipo para TableFilterStatus, pois inclui 'Todos'
  onFilterChange: (filter: TableFilterStatus) => void;
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
  onSettingsClick: () => void; // NOVO: Prop para o clique no botão de configurações
}

const TableHeader: React.FC<TableHeaderProps> = ({ currentFilter, onFilterChange, currentSort, onSortChange, onSettingsClick }) => { // Adicione onSettingsClick aqui
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
              // AQUI: O valor já é TableFilterStatus pelo select, não precisa de cast extra
              onChange={(e) => onFilterChange(e.target.value as TableFilterStatus)}
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
        {/* NOVO: Botão de Configurações */}
        <IconButton
          color="inherit" // Cor do ícone
          aria-label="settings"
          onClick={onSettingsClick} // Usa a nova prop de clique
          sx={{
            marginLeft: 2, // Margem à esquerda para separar dos selects
            color: 'text.secondary', // Cor padrão do ícone
            '&:hover': {
              color: 'primary.main', // Cor ao passar o mouse
            },
          }}
        >
          <SettingsIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default TableHeader;