import React, { useState } from 'react';
import { Container, Box, TextField, Button, Typography, CircularProgress, Alert } from '@mui/material';
import { useAuth } from '../shared/context/AuthContext';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [cpf, setCpf] = useState(''); // O estado agora é para o CPF
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redireciona se já estiver autenticado
  if (isAuthenticated) {
    navigate('/tables', { replace: true }); // Redireciona e substitui a entrada no histórico
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    // Validação básica do CPF (pode ser mais robusta)
    if (!cpf || cpf.replace(/\D/g, '').length !== 11) {
      setError("Por favor, insira um CPF válido (apenas números).");
      setLoading(false);
      return;
    }

    try {
      const success = await login(cpf); // Passa o CPF para a função de login
      if (success) {
        // A navegação já é tratada pelo 'if (isAuthenticated)' acima
        // Mas podemos colocar um log ou algo para confirmar
        console.log("Login por CPF bem-sucedido!");
      } else {
        // A mensagem de erro já vem do AuthService ou da exceção
        setError('Funcionário não encontrado ou CPF inválido. Por favor, verifique o CPF.');
      }
    } catch (err: any) { // Captura o erro para exibir a mensagem específica
      setError(err.message || 'Ocorreu um erro ao tentar fazer login. Verifique sua conexão ou tente novamente.');
      console.error("Erro de 'login' por CPF:", err);
    } finally {
      setLoading(false);
    }
  };

  // Função para formatar o CPF enquanto o usuário digita
  const formatCpf = (value: string) => {
    const numericValue = value.replace(/\D/g, ''); // Remove tudo que não for dígito
    if (numericValue.length <= 3) return numericValue;
    if (numericValue.length <= 6) return `${numericValue.slice(0, 3)}.${numericValue.slice(3)}`;
    if (numericValue.length <= 9) return `${numericValue.slice(0, 3)}.${numericValue.slice(3, 6)}.${numericValue.slice(6)}`;
    return `${numericValue.slice(0, 3)}.${numericValue.slice(3, 6)}.${numericValue.slice(6, 9)}-${numericValue.slice(9, 11)}`;
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCpf(e.target.value);
    setCpf(formatted);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 3,
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: 'white',
        }}
      >
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          Entrada de Funcionário
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="cpf"
            label="CPF do Funcionário"
            name="cpf"
            autoComplete="off" // Desativa o autocomplete para CPF
            autoFocus
            value={cpf}
            onChange={handleCpfChange}
            inputProps={{ maxLength: 14 }} // Limita o tamanho do input formatado
          />
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, backgroundColor:'primary.dark', color:'primary.contrastText',
              '&:hover':{
                backgroundColor:'primary.light'
              }
            }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Entrar no Sistema'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default LoginPage;