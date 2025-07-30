import React from 'react';
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import type { EmployeeActionsMenuProps } from './types';

const EmployeeActionsMenu: React.FC<EmployeeActionsMenuProps> = ({
  anchorEl,
  selectedEmployee,
  onClose,
  onToggleStatus,
  onDelete,
}) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: 1,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '1px solid #e0e0e0',
          minWidth: 180
        }
      }}
    >
      <MenuItem 
        onClick={onToggleStatus}
        sx={{
          '&:hover': {
            backgroundColor: selectedEmployee?.ativo ? '#ffebee' : '#e8f5e8'
          }
        }}
      >
        <ListItemIcon>
          {selectedEmployee?.ativo ? 
            <CancelIcon fontSize="small" sx={{ color: '#f44336' }} /> : 
            <CheckCircleIcon fontSize="small" sx={{ color: '#4caf50' }} />
          }
        </ListItemIcon>
        <ListItemText>
          {selectedEmployee?.ativo ? 'Desativar' : 'Ativar'}
        </ListItemText>
      </MenuItem>
      <MenuItem 
        onClick={onDelete}
        sx={{
          '&:hover': {
            backgroundColor: '#ffebee'
          }
        }}
      >
        <ListItemIcon>
          <DeleteIcon fontSize="small" sx={{ color: '#f44336' }} />
        </ListItemIcon>
        <ListItemText>Excluir</ListItemText>
      </MenuItem>
    </Menu>
  );
};

export default EmployeeActionsMenu; 