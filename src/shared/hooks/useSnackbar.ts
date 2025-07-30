import { useState, useCallback } from 'react';

interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
}

interface UseSnackbarReturn {
  snackbar: SnackbarState;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showWarning: (message: string) => void;
  showInfo: (message: string) => void;
  closeSnackbar: () => void;
}

export const useSnackbar = (): UseSnackbarReturn => {
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'success',
  });

  const showSuccess = useCallback((message: string) => {
    setSnackbar({
      open: true,
      message,
      severity: 'success',
    });
  }, []);

  const showError = useCallback((message: string) => {
    setSnackbar({
      open: true,
      message,
      severity: 'error',
    });
  }, []);

  const showWarning = useCallback((message: string) => {
    setSnackbar({
      open: true,
      message,
      severity: 'warning',
    });
  }, []);

  const showInfo = useCallback((message: string) => {
    setSnackbar({
      open: true,
      message,
      severity: 'info',
    });
  }, []);

  const closeSnackbar = useCallback(() => {
    setSnackbar(prev => ({ ...prev, open: false }));
  }, []);

  return {
    snackbar,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    closeSnackbar,
  };
}; 