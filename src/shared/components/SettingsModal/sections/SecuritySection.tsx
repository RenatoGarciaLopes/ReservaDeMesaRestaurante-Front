import React, { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    CircularProgress,
    Alert,
    InputAdornment,
    IconButton,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useAuth } from '../../../context/AuthContext';
import EmployeeService from '../../../services/EmployeeService';
import type { PasswordFormData } from '../types';

export function SecuritySection() {
    const { employee } = useAuth();
    
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordSuccessMessage, setPasswordSuccessMessage] = useState<string | null>(null);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState<string | null>(null);

    // Estados para os campos de senha
    const [passwordData, setPasswordData] = useState<PasswordFormData>({
        senhaAtual: '',
        novaSenha: '',
        confirmarSenha: '',
    });

    const [showSenhaAtual, setShowSenhaAtual] = useState(false);
    const [showNovaSenha, setShowNovaSenha] = useState(false);
    const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);

    const handleChangePassword = async () => {
        setPasswordLoading(true);
        setPasswordSuccessMessage(null);
        setPasswordErrorMessage(null);

        if (!employee) {
            setPasswordErrorMessage("Nenhum funcionário logado para alterar senha.");
            setPasswordLoading(false);
            return;
        }

        // Validações mais robustas
        if (!passwordData.senhaAtual.trim()) {
            setPasswordErrorMessage("A senha atual é obrigatória.");
            setPasswordLoading(false);
            return;
        }

        if (!passwordData.novaSenha.trim()) {
            setPasswordErrorMessage("A nova senha é obrigatória.");
            setPasswordLoading(false);
            return;
        }

        if (!passwordData.confirmarSenha.trim()) {
            setPasswordErrorMessage("A confirmação da nova senha é obrigatória.");
            setPasswordLoading(false);
            return;
        }

        if (passwordData.novaSenha.trim() !== passwordData.confirmarSenha.trim()) {
            setPasswordErrorMessage("A nova senha e a confirmação não coincidem.");
            setPasswordLoading(false);
            return;
        }

        if (passwordData.novaSenha.trim().length < 6) {
            setPasswordErrorMessage("A nova senha deve ter pelo menos 6 caracteres.");
            setPasswordLoading(false);
            return;
        }

        if (passwordData.senhaAtual.trim() === passwordData.novaSenha.trim()) {
            setPasswordErrorMessage("A nova senha deve ser diferente da senha atual.");
            setPasswordLoading(false);
            return;
        }

        try {
            await EmployeeService.changePassword(employee.email, {
                senhaAtual: passwordData.senhaAtual.trim(),
                novaSenha: passwordData.novaSenha.trim(),
                confirmarNovaSenha: passwordData.confirmarSenha.trim()
            });

            setPasswordSuccessMessage("Senha alterada com sucesso!");

            // Limpar campos de senha
            setPasswordData({
                senhaAtual: '',
                novaSenha: '',
                confirmarSenha: '',
            });
            // Ocultar senhas
            setShowSenhaAtual(false);
            setShowNovaSenha(false);
            setShowConfirmarSenha(false);
        } catch (error: any) {
            console.error("Erro ao alterar senha:", error);
            setPasswordErrorMessage(error.message || "Erro ao alterar senha. Tente novamente.");
        } finally {
            setPasswordLoading(false);
        }
    };

    if (!employee) {
        return <Typography>Nenhum funcionário logado.</Typography>;
    }

    return (
        <Box>
            <Typography variant="h6" gutterBottom>Segurança</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Gerencie suas configurações de segurança e altere sua senha.
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>Alterar Senha</Typography>

            <TextField
                margin="dense"
                label="Senha Atual"
                type={showSenhaAtual ? 'text' : 'password'}
                fullWidth
                variant="outlined"
                value={passwordData.senhaAtual}
                onChange={(e) => setPasswordData(prev => ({ ...prev, senhaAtual: e.target.value }))}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                onClick={() => setShowSenhaAtual(!showSenhaAtual)}
                                edge="end"
                            >
                                {showSenhaAtual ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
                sx={{ mb: 2 }}
            />

            <TextField
                margin="dense"
                label="Nova Senha"
                type={showNovaSenha ? 'text' : 'password'}
                fullWidth
                variant="outlined"
                value={passwordData.novaSenha}
                onChange={(e) => setPasswordData(prev => ({ ...prev, novaSenha: e.target.value }))}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                onClick={() => setShowNovaSenha(!showNovaSenha)}
                                edge="end"
                            >
                                {showNovaSenha ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
                sx={{ mb: 2 }}
            />

            <TextField
                margin="dense"
                label="Confirmar Nova Senha"
                type={showConfirmarSenha ? 'text' : 'password'}
                fullWidth
                variant="outlined"
                value={passwordData.confirmarSenha}
                onChange={(e) => setPasswordData(prev => ({ ...prev, confirmarSenha: e.target.value }))}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                onClick={() => setShowConfirmarSenha(!showConfirmarSenha)}
                                edge="end"
                            >
                                {showConfirmarSenha ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
                sx={{ mb: 2 }}
            />

            {passwordLoading && <CircularProgress size={24} sx={{ mt: 2 }} />}
            {passwordSuccessMessage && <Alert severity="success" sx={{ mt: 2 }}>{passwordSuccessMessage}</Alert>}
            {passwordErrorMessage && <Alert severity="error" sx={{ mt: 2 }}>{passwordErrorMessage}</Alert>}

            <Button
                variant="contained"
                sx={{
                    mt: 3, backgroundColor: 'primary.dark', color: 'primary.contrastText',
                    '&:hover': {
                        backgroundColor: 'primary.light'
                    }
                }}
                onClick={handleChangePassword}
                disabled={passwordLoading}
            >
                Alterar Senha
            </Button>
        </Box>
    );
} 