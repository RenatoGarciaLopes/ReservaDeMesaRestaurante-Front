import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Alert,
} from '@mui/material';
import {
  Security as SecurityIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import { useField } from 'formik';

const SecurityStep: React.FC = () => {
  const [senhaField, senhaMeta, senhaHelpers] = useField('security.senha');
  const [confirmarSenhaField, confirmarSenhaMeta, confirmarSenhaHelpers] = useField('security.confirmarSenha');
  
  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);

  const handleToggleSenhaVisibility = () => setShowSenha(!showSenha);
  const handleToggleConfirmarSenhaVisibility = () => setShowConfirmarSenha(!showConfirmarSenha);

  const validateSenha = (senha: string) => {
    const errors = [];
    if (senha.length < 8) errors.push('Mínimo 8 caracteres');
    if (!/(?=.*[a-z])/.test(senha)) errors.push('Uma letra minúscula');
    if (!/(?=.*[A-Z])/.test(senha)) errors.push('Uma letra maiúscula');
    if (!/(?=.*\d)/.test(senha)) errors.push('Um número');
    return errors;
  };

  const senhaErrors = validateSenha(senhaField.value);

  return (
    <Box sx={{ 
      p: 4, 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 3,
      minHeight: '400px',
      justifyContent: 'center'
    }}>
      <Box sx={{ mb: 2 }}>
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 600, 
            color: '#1a1a1a',
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            mb: 1
          }}
        >
          <SecurityIcon sx={{ color: '#1976d2' }} />
          Configuração de Senha
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Defina uma senha segura para o colaborador
        </Typography>
      </Box>

      <TextField
        {...senhaField}
        label="Senha"
        type={showSenha ? 'text' : 'password'}
        fullWidth
        variant="outlined"
        error={senhaMeta.touched && Boolean(senhaMeta.error)}
        helperText={senhaMeta.touched && senhaMeta.error}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LockIcon sx={{ color: '#666' }} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={handleToggleSenhaVisibility}
                edge="end"
                size="small"
              >
                {showSenha ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            '&:hover fieldset': {
              borderColor: '#1976d2',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#1976d2',
            },
          },
        }}
      />

      <TextField
        {...confirmarSenhaField}
        label="Confirmar senha"
        type={showConfirmarSenha ? 'text' : 'password'}
        fullWidth
        variant="outlined"
        error={confirmarSenhaMeta.touched && Boolean(confirmarSenhaMeta.error)}
        helperText={confirmarSenhaMeta.touched && confirmarSenhaMeta.error}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LockIcon sx={{ color: '#666' }} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={handleToggleConfirmarSenhaVisibility}
                edge="end"
                size="small"
              >
                {showConfirmarSenha ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            '&:hover fieldset': {
              borderColor: '#1976d2',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#1976d2',
            },
          },
        }}
      />

      {senhaField.value && (
        <Alert 
          severity={senhaErrors.length === 0 ? 'success' : 'info'} 
          sx={{ 
            borderRadius: 2,
            '& .MuiAlert-message': {
              fontSize: '0.875rem'
            }
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Requisitos da senha:
          </Typography>
          <Box component="ul" sx={{ m: 0, pl: 2 }}>
            {senhaErrors.length === 0 ? (
              <li>Senha atende todos os requisitos de segurança</li>
            ) : (
              senhaErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))
            )}
          </Box>
        </Alert>
      )}
    </Box>
  );
};

export default SecurityStep; 