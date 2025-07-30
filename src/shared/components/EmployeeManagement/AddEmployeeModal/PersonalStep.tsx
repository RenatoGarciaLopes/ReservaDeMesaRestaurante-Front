import React from 'react';
import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
} from '@mui/material';
import {
  Person as PersonIcon,
  Work as WorkIcon,
  Badge as BadgeIcon,
} from '@mui/icons-material';
import { useField } from 'formik';
import type { Cargo } from '../../../types/Employee';

interface PersonalStepProps {
  formatCpf: (value: string) => string;
}

const PersonalStep: React.FC<PersonalStepProps> = ({ formatCpf }) => {
  const [nomeField, nomeMeta, nomeHelpers] = useField('personal.nome');
  const [cpfField, cpfMeta, cpfHelpers] = useField('personal.cpf');
  const [cargoField, cargoMeta, cargoHelpers] = useField('personal.cargo');

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCpf(e.target.value);
    cpfHelpers.setValue(formattedValue);
  };

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
          <PersonIcon sx={{ color: '#1976d2' }} />
          Dados Pessoais
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Informações básicas do colaborador
        </Typography>
      </Box>

      <TextField
        {...nomeField}
        label="Nome completo"
        fullWidth
        variant="outlined"
        error={nomeMeta.touched && Boolean(nomeMeta.error)}
        helperText={nomeMeta.touched && nomeMeta.error}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <PersonIcon sx={{ color: '#666' }} />
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
        value={cpfField.value}
        onChange={handleCpfChange}
        onBlur={cpfField.onBlur}
        label="CPF"
        fullWidth
        variant="outlined"
        error={cpfMeta.touched && Boolean(cpfMeta.error)}
        helperText={cpfMeta.touched && cpfMeta.error}
        placeholder="000.000.000-00"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <BadgeIcon sx={{ color: '#666' }} />
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

      <FormControl fullWidth variant="outlined">
        <InputLabel>Cargo</InputLabel>
        <Select
          {...cargoField}
          label="Cargo"
          error={cargoMeta.touched && Boolean(cargoMeta.error)}
          startAdornment={
            <InputAdornment position="start">
              <WorkIcon sx={{ color: '#666' }} />
            </InputAdornment>
          }
          sx={{
            borderRadius: 2,
            '& .MuiOutlinedInput-notchedOutline': {
              '&:hover': {
                borderColor: '#1976d2',
              },
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#1976d2',
            },
          }}
        >
          <MenuItem value="GARCOM">Garçom</MenuItem>
          <MenuItem value="COZINHEIRO">Cozinheiro</MenuItem>
          <MenuItem value="RECEPCIONISTA">Recepcionista</MenuItem>
          <MenuItem value="GERENTE">Gerente</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default PersonalStep; 