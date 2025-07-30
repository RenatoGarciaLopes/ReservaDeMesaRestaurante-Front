import React from 'react';
import {
  TableRow,
  TableCell,
  Checkbox,
  Box,
  Typography,
  Avatar,
  Chip,
  IconButton,
} from '@mui/material';
import {
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  MoreVert as MoreVertIcon,
  Work as WorkIcon,
} from '@mui/icons-material';
import type { EmployeeTableRowProps } from './types';
import { getInitials, getAvatarColor, getEmployeeDisplayDate } from '../../utils/employeeUtils';

const EmployeeTableRow: React.FC<EmployeeTableRowProps> = ({
  employee,
  index,
  isSelected,
  onSelect,
  onOpenActionsMenu,
}) => {
  return (
    <TableRow 
      hover
      sx={{ 
        backgroundColor: index % 2 === 0 ? '#ffffff' : '#fafafa',
        '&:hover': {
          backgroundColor: '#f8f9fa',
          transform: 'scale(1.01)',
          transition: 'all 0.2s ease'
        },
        transition: 'all 0.2s ease'
      }}
    >
      <TableCell padding="checkbox">
        <Checkbox
          checked={isSelected}
          onChange={onSelect}
          sx={{
            '&.Mui-checked': {
              color: '#4caf50'
            }
          }}
        />
      </TableCell>
      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar 
            sx={{ 
              width: 40, 
              height: 40, 
              fontSize: '1rem',
              fontWeight: 600,
              backgroundColor: getAvatarColor(employee.nome)
            }}
          >
            {getInitials(employee.nome)}
          </Avatar>
          <Box>
            <Typography variant="body1" sx={{ fontWeight: 600, color: '#2c3e50' }}>
              {employee.nome}
            </Typography>
            <Typography variant="caption" sx={{ color: '#7f8c8d', display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <WorkIcon sx={{ fontSize: 12 }} />
              {employee.cargo}
            </Typography>
          </Box>
        </Box>
      </TableCell>
      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <EmailIcon sx={{ fontSize: 16, color: '#666' }} />
          <Typography variant="body2" sx={{ color: '#34495e' }}>
            {employee.email}
          </Typography>
        </Box>
      </TableCell>
      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CalendarIcon sx={{ fontSize: 16, color: '#666' }} />
          <Typography variant="body2" sx={{ color: '#34495e' }}>
            {getEmployeeDisplayDate(employee)}
          </Typography>
        </Box>
      </TableCell>
      <TableCell>
        {employee.ativo !== false ? (
          <Chip
            icon={<CheckCircleIcon />}
            label="Ativo"
            size="small"
            sx={{
              backgroundColor: '#e8f5e8',
              color: '#2e7d32',
              fontWeight: 600,
              '& .MuiChip-icon': {
                color: '#4caf50'
              }
            }}
          />
        ) : (
          <Chip
            icon={<CancelIcon />}
            label="Inativo"
            size="small"
            sx={{
              backgroundColor: '#ffebee',
              color: '#c62828',
              fontWeight: 600,
              '& .MuiChip-icon': {
                color: '#f44336'
              }
            }}
          />
        )}
      </TableCell>
      <TableCell>
        <IconButton
          size="small"
          onClick={onOpenActionsMenu}
        >
          <MoreVertIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default EmployeeTableRow; 