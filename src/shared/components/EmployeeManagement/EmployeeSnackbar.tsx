import React from 'react';
import {
  Snackbar,
  Alert,
} from '@mui/material';

interface EmployeeSnackbarProps {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
}

const EmployeeSnackbar: React.FC<EmployeeSnackbarProps> = ({
  open,
  message,
  severity,
  onClose,
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert 
        onClose={onClose} 
        severity={severity}
        sx={{ 
          width: '100%',
          borderRadius: 1,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          fontWeight: 600,
          '& .MuiAlert-icon': {
            fontSize: 24
          }
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default EmployeeSnackbar; 