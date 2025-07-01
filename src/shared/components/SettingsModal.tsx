// src/shared/components/SettingsModal.tsx

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useAuth } from '../context/AuthContext';
import EmployeeService from '../services/EmployeeService'; // Importe o serviço de funcionário
import type { Cargo } from '../types/Employee'; // Importe o tipo Cargo

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

function SettingsModal({ open, onClose }: SettingsModalProps) {
  const { employee, logout, login } = useAuth(); // Obtenha o funcionário logado, logout e login (para re-autenticar após atualização)

  const [currentSection, setCurrentSection] = useState('profile'); // 'profile' ou outras futuras
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Estados para os campos do formulário de perfil
  const [nome, setNome] = useState(employee?.nome || '');
  const [email, setEmail] = useState(employee?.email || '');
  const [telefone, setTelefone] = useState(employee?.telefone || '');
  const [cargo, setCargo] = useState<Cargo>(employee?.cargo || 'GARCOM'); // Defina um valor padrão ou null
  const [cpf, setCpf] = useState(employee?.cpf || ''); // CPF será exibido, mas não editável

  useEffect(() => {
    if (open && employee) {
      setNome(employee.nome);
      setEmail(employee.email);
      setTelefone(employee.telefone);
      setCargo(employee.cargo);
      setCpf(employee.cpf); // CPF não será editável
      setSuccessMessage(null);
      setErrorMessage(null);
    }
  }, [open, employee]);

  const handleLogout = () => {
    logout();
    onClose();
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    if (!employee) {
      setErrorMessage("Nenhum funcionário logado para atualizar.");
      setLoading(false);
      return;
    }

    try {
      // Limpar o telefone para enviar ao backend se necessário, ou enviar como está
      const telefoneLimpo = telefone.replace(/[^\d()]/g, '');

      const updatedEmployeeData = {
        nome,
        email,
        telefone: telefoneLimpo, // Envia o telefone limpo
        cargo // Cargo é um enum no backend, deve ser enviado como string
      };

      // Chamar o serviço para atualizar o funcionário
      // Seu backend tem um endpoint PUT /api/funcionarios/{id}
      await EmployeeService.updateEmployee(employee.id, updatedEmployeeData);

      // Re-fetch os dados do funcionário para atualizar o contexto
      // Ou re-autenticar o usuário para ter os dados mais recentes
      await login(employee.cpf); // Usa a função login do contexto para atualizar o employee

      setSuccessMessage("Dados atualizados com sucesso!");
    } catch (error: any) {
      console.error("Erro ao atualizar dados do funcionário:", error);
      setErrorMessage(error.message || "Erro ao atualizar dados. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // Função para formatar o telefone enquanto o usuário digita
  const formatTelefone = (value: string) => {
    const numericValue = value.replace(/\D/g, ''); // Remove tudo que não for dígito
    if (numericValue.length <= 2) return numericValue;
    if (numericValue.length <= 6) return `(${numericValue.slice(0, 2)})${numericValue.slice(2)}`;
    if (numericValue.length <= 10) return `(${numericValue.slice(0, 2)})${numericValue.slice(2, 6)}-${numericValue.slice(6)}`;
    return `(${numericValue.slice(0, 2)})${numericValue.slice(2, 7)}-${numericValue.slice(7, 11)}`;
  };

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatTelefone(e.target.value);
    setTelefone(formatted);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth> {/* Aumenta maxWidth para acomodar a barra lateral e conteúdo */}
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" component="div">
          Configurações
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 0 }}>
        <Box sx={{ display: 'flex', minHeight: 400 }}> {/* minHeight para dar espaço */}
          {/* Barra Lateral */}
          <Box
            sx={{
              width: 200,
              flexShrink: 0,
              borderRight: '1px solid #e0e0e0',
              backgroundColor: '#f8f8f8',
            }}
          >
            <List>
              <ListItem disablePadding>
                <ListItemButton onClick={() => setCurrentSection('profile')} selected={currentSection === 'profile'}>
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText primary="Perfil" />
                </ListItemButton>
              </ListItem>
              {/* Adicione mais itens aqui para outras seções futuras */}
            </List>
            <Divider />
            <List>
              <ListItem disablePadding>
                <ListItemButton onClick={handleLogout}>
                  <ListItemIcon>
                    <ExitToAppIcon />
                  </ListItemIcon>
                  <ListItemText primary="Sair do Sistema" />
                </ListItemButton>
              </ListItem>
            </List>
          </Box>

          {/* Conteúdo Principal do Modal */}
          <Box sx={{ flexGrow: 1, p: 3 }}>
            {currentSection === 'profile' && employee && (
              <Box>
                <Typography variant="h6" gutterBottom>Meu Perfil</Typography>
                <TextField
                  margin="dense"
                  label="Nome"
                  fullWidth
                  variant="outlined"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  margin="dense"
                  label="Email"
                  fullWidth
                  variant="outlined"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  margin="dense"
                  label="Telefone"
                  fullWidth
                  variant="outlined"
                  value={telefone}
                  onChange={handleTelefoneChange}
                  inputProps={{ maxLength: 15 }} // Ex: (XX)XXXXX-XXXX
                  sx={{ mb: 2 }}
                />
                <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
                  <InputLabel>Cargo</InputLabel>
                  <Select
                    value={cargo}
                    label="Cargo"
                    onChange={(e) => setCargo(e.target.value as Cargo)}
                  >
                    {/* Renderize as opções de Cargo dinamicamente ou listadas */}
                    {Object.values(CargoOptions).map((option) => (
                      <MenuItem key={option} value={option}>{option}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  margin="dense"
                  label="CPF"
                  fullWidth
                  variant="outlined"
                  value={cpf}
                  disabled // CPF não editável
                  sx={{ mb: 2, '& .MuiInputBase-input.Mui-disabled': { WebkitTextFillColor: '#000000', opacity: 1 } }}
                />

                {loading && <CircularProgress size={24} sx={{ mt: 2 }} />}
                {successMessage && <Alert severity="success" sx={{ mt: 2 }}>{successMessage}</Alert>}
                {errorMessage && <Alert severity="error" sx={{ mt: 2 }}>{errorMessage}</Alert>}

                <Button
                  variant="contained"
                  sx={{ mt: 3, backgroundColor:'primary.dark', color:'primary.contrastText',
                    '&:hover':{
                      backgroundColor:'primary.light'
                    }
                  }}
                  onClick={handleUpdateProfile}
                  disabled={loading}
                >
                  Atualizar dados
                </Button>
                <Button
                  variant="outlined"
                  color="error" // Cor de erro para o botão de sair
                  sx={{ mt: 2, display: 'block' }} // display: block para quebrar linha
                  onClick={handleLogout}
                  disabled={loading}
                >
                  Sair do perfil
                </Button>
              </Box>
            )}
            {/* Adicione outras seções aqui conforme `currentSection` */}
            {!employee && !loading && (
                <Typography>Nenhum funcionário logado.</Typography>
            )}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

// Para mapear seus enums de Cargo, se não for feito no backend de forma explícita
// ou se quiser uma lista fixa no frontend. Ajuste conforme seus valores de Cargo
const CargoOptions: Record<string, Cargo> = {
  GARCOM: 'GARCOM',
  COZINHEIRO: 'COZINHEIRO',
  RECEPCIONISTA: 'RECEPCIONISTA',
};

export default SettingsModal;