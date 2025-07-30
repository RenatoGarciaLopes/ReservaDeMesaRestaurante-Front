import React from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material';
import { useField } from 'formik';

interface ContactStepProps {
  formatTelefone: (value: string) => string;
}

const ContactStep: React.FC<ContactStepProps> = ({ formatTelefone }) => {
  const [emailField, emailMeta, emailHelpers] = useField('contact.email');
  const [telefoneField, telefoneMeta, telefoneHelpers] = useField('contact.telefone');

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatTelefone(e.target.value);
    telefoneHelpers.setValue(formattedValue);
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
          <EmailIcon sx={{ color: '#1976d2' }} />
          Informações de Contato
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Email e telefone para comunicação
        </Typography>
      </Box>

      <TextField
        {...emailField}
        label="Email"
        type="email"
        fullWidth
        variant="outlined"
        error={emailMeta.touched && Boolean(emailMeta.error)}
        helperText={emailMeta.touched && emailMeta.error}
        placeholder="exemplo@email.com"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <EmailIcon sx={{ color: '#666' }} />
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
        value={telefoneField.value}
        onChange={handleTelefoneChange}
        onBlur={telefoneField.onBlur}
        label="Telefone"
        fullWidth
        variant="outlined"
        error={telefoneMeta.touched && Boolean(telefoneMeta.error)}
        helperText={telefoneMeta.touched && telefoneMeta.error}
        placeholder="(00) 00000-0000"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <PhoneIcon sx={{ color: '#666' }} />
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
    </Box>
  );
};

export default ContactStep; 