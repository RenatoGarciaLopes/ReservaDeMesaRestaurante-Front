import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Divider,
} from '@mui/material';
import {
  Check as CheckIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Security as SecurityIcon,
  Work as WorkIcon,
  Phone as PhoneIcon,
  Badge as BadgeIcon,
} from '@mui/icons-material';
import { useFormikContext } from 'formik';

interface FormValues {
  personal: {
    nome: string;
    cpf: string;
    cargo: string;
  };
  contact: {
    email: string;
    telefone: string;
  };
  security: {
    senha: string;
    confirmarSenha: string;
  };
}

const ReviewStep: React.FC = () => {
  const { values } = useFormikContext<FormValues>();

  const getCargoLabel = (cargo: string) => {
    const cargos = {
      'GARCOM': 'Garçom',
      'COZINHEIRO': 'Cozinheiro',
      'RECEPCIONISTA': 'Recepcionista',
      'GERENTE': 'Gerente',
    };
    return cargos[cargo as keyof typeof cargos] || cargo;
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
          <CheckIcon sx={{ color: '#1976d2' }} />
          Revisão dos Dados
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Confirme os dados antes de criar o colaborador
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Dados Pessoais */}
        <Card 
          variant="outlined" 
          sx={{ 
            borderRadius: 2,
            borderColor: '#e0e0e0',
            '&:hover': {
              borderColor: '#1976d2',
              boxShadow: '0 2px 8px rgba(25, 118, 210, 0.1)'
            }
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <PersonIcon sx={{ color: '#1976d2' }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                Dados Pessoais
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <PersonIcon sx={{ color: '#666', fontSize: 20 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Nome completo
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {values.personal.nome}
                  </Typography>
                </Box>
              </Box>
              
              <Divider />
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <BadgeIcon sx={{ color: '#666', fontSize: 20 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    CPF
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {values.personal.cpf}
                  </Typography>
                </Box>
              </Box>
              
              <Divider />
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <WorkIcon sx={{ color: '#666', fontSize: 20 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Cargo
                  </Typography>
                  <Chip 
                    label={getCargoLabel(values.personal.cargo)} 
                    size="small" 
                    sx={{ 
                      backgroundColor: '#e3f2fd', 
                      color: '#1976d2',
                      fontWeight: 500
                    }} 
                  />
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Contato */}
        <Card 
          variant="outlined" 
          sx={{ 
            borderRadius: 2,
            borderColor: '#e0e0e0',
            '&:hover': {
              borderColor: '#1976d2',
              boxShadow: '0 2px 8px rgba(25, 118, 210, 0.1)'
            }
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <EmailIcon sx={{ color: '#1976d2' }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                Informações de Contato
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <EmailIcon sx={{ color: '#666', fontSize: 20 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {values.contact.email}
                  </Typography>
                </Box>
              </Box>
              
              <Divider />
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <PhoneIcon sx={{ color: '#666', fontSize: 20 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Telefone
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {values.contact.telefone}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Segurança */}
        <Card 
          variant="outlined" 
          sx={{ 
            borderRadius: 2,
            borderColor: '#e0e0e0',
            '&:hover': {
              borderColor: '#1976d2',
              boxShadow: '0 2px 8px rgba(25, 118, 210, 0.1)'
            }
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <SecurityIcon sx={{ color: '#1976d2' }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                Configuração de Segurança
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <SecurityIcon sx={{ color: '#666', fontSize: 20 }} />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Status da senha
                </Typography>
                <Chip 
                  label="Senha configurada com sucesso" 
                  size="small" 
                  color="success"
                  sx={{ fontWeight: 500 }}
                />
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default ReviewStep; 