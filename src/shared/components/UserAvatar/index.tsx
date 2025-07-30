import React, { useState } from 'react';
import {
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Tooltip,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

interface UserAvatarProps {
  onOpenSettings: () => void;
}

export function UserAvatar({ onOpenSettings }: UserAvatarProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { logout, employee } = useAuth();
  
  const open = Boolean(anchorEl);
  
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSettings = () => {
    handleClose();
    onOpenSettings();
  };

  const handleLogout = () => {
    handleClose();
    logout();
  };

  // Obter as iniciais do nome do funcionário
  const getInitials = () => {
    if (!employee?.nome) return 'U';
    const names = employee.nome.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <>
      <Tooltip title="Menu do usuário">
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ 
            ml: 2,
            '&:hover': { 
              backgroundColor: 'rgba(0, 0, 0, 0.04)' 
            }
          }}
          aria-controls={open ? 'user-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <Avatar 
            sx={{ 
              width: 32, 
              height: 32,
              bgcolor: 'primary.main',
              color: 'white',
              fontSize: '0.875rem',
              fontWeight: 600
            }}
          >
            {getInitials()}
          </Avatar>
        </IconButton>
      </Tooltip>
      
      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          elevation: 3,
          sx: {
            minWidth: 200,
            mt: 1,
            '& .MuiMenuItem-root': {
              py: 1.5,
              px: 2,
            },
          },
        }}
      >
        <MenuItem disabled sx={{ opacity: 0.7 }}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText 
            primary={employee?.nome || 'Usuário'} 
            secondary={employee?.cargo || 'Funcionário'}
            primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500 }}
            secondaryTypographyProps={{ fontSize: '0.75rem' }}
          />
        </MenuItem>
        
        <Divider />
        
        <MenuItem onClick={handleSettings}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Configurações" />
        </MenuItem>
        
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Sair" />
        </MenuItem>
      </Menu>
    </>
  );
}

export default UserAvatar; 