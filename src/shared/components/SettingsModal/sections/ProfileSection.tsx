import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    Alert,
    InputAdornment,
    Divider,
    IconButton,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useAuth } from '../../../context/AuthContext';
import EmployeeService from '../../../services/EmployeeService';
import type { Cargo } from '../../../types/Employee';
import type { ProfileFormData, PasswordFormData } from '../types';

interface ProfileSectionProps {
    onLogout: () => void;
}

const CargoOptions: Record<string, Cargo> = {
    GARCOM: 'GARCOM',
    COZINHEIRO: 'COZINHEIRO',
    RECEPCIONISTA: 'RECEPCIONISTA',
    GERENTE: 'GERENTE',
};

export function ProfileSection({ onLogout }: ProfileSectionProps) {
    const { employee } = useAuth();
    
    const [loading, setLoading] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [passwordSuccessMessage, setPasswordSuccessMessage] = useState<string | null>(null);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState<string | null>(null);

    // Estados para os campos do formulário de perfil
    const [profileData, setProfileData] = useState<ProfileFormData>({
        nome: '',
        email: '',
        telefone: '',
        cargo: 'GARCOM',
        cpf: '',
    });

    // Estados para os campos de senha
    const [passwordData, setPasswordData] = useState<PasswordFormData>({
        senhaAtual: '',
        novaSenha: '',
        confirmarSenha: '',
    });

    const [showSenhaAtual, setShowSenhaAtual] = useState(false);
    const [showNovaSenha, setShowNovaSenha] = useState(false);
    const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);

    useEffect(() => {
        if (employee) {
            setProfileData({
                nome: employee.nome,
                email: employee.email,
                telefone: employee.telefone,
                cargo: employee.cargo,
                cpf: employee.cpf,
            });
        }
    }, [employee]);

    const handleUpdateProfile = async () => {
        setLoading(true);
        setSuccessMessage(null);
        setErrorMessage(null);

        if (!employee) {
            setErrorMessage("Nenhum funcionário logado para atualizar.");
            setLoading(false);
            return;
        }

        // Validação de permissão para alterar cargo para GERENTE
        if (profileData.cargo === 'GERENTE' && employee.cargo !== 'GERENTE') {
            setErrorMessage("Apenas gerentes podem alterar o cargo para GERENTE.");
            setLoading(false);
            return;
        }

        try {
            const telefoneLimpo = profileData.telefone.replace(/[^\d()]/g, '');

            const updatedEmployeeData = {
                nome: profileData.nome,
                email: profileData.email,
                telefone: telefoneLimpo,
                cargo: profileData.cargo as Cargo,
            };

            await EmployeeService.updateEmployee(employee.id, updatedEmployeeData);

            setSuccessMessage("Dados atualizados com sucesso!");
        } catch (error: any) {
            console.error("Erro ao atualizar dados do funcionário:", error);
            setErrorMessage(error.message || "Erro ao atualizar dados. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

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
        setProfileData(prev => ({ ...prev, telefone: formatted }));
    };

    if (!employee) {
        return <Typography>Nenhum funcionário logado.</Typography>;
    }

    return (
        <Box>
            <Typography variant="h6" gutterBottom>Meu Perfil</Typography>
            <TextField
                margin="dense"
                label="Nome"
                fullWidth
                variant="outlined"
                value={profileData.nome}
                onChange={(e) => setProfileData(prev => ({ ...prev, nome: e.target.value }))}
                sx={{ mb: 2 }}
            />
            <TextField
                margin="dense"
                label="Email"
                fullWidth
                variant="outlined"
                value={profileData.email}
                onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                sx={{ mb: 2 }}
            />
            <TextField
                margin="dense"
                label="Telefone"
                fullWidth
                variant="outlined"
                value={profileData.telefone}
                onChange={handleTelefoneChange}
                inputProps={{ maxLength: 15 }}
                sx={{ mb: 2 }}
            />
            <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
                <InputLabel>Cargo</InputLabel>
                <Select
                    value={profileData.cargo}
                    label="Cargo"
                    onChange={(e) => setProfileData(prev => ({ ...prev, cargo: e.target.value }))}
                >
                    {Object.values(CargoOptions)
                        .filter((option) => {
                            if (employee.cargo === 'GERENTE') {
                                return true;
                            }
                            return option !== 'GERENTE';
                        })
                        .map((option) => (
                            <MenuItem key={option} value={option}>{option}</MenuItem>
                        ))}
                </Select>
            </FormControl>
            <TextField
                margin="dense"
                label="CPF"
                fullWidth
                variant="outlined"
                value={profileData.cpf}
                disabled
                sx={{ mb: 2, '& .MuiInputBase-input.Mui-disabled': { WebkitTextFillColor: '#000000', opacity: 1 } }}
            />

            {loading && <CircularProgress size={24} sx={{ mt: 2 }} />}
            {successMessage && <Alert severity="success" sx={{ mt: 2 }}>{successMessage}</Alert>}
            {errorMessage && <Alert severity="error" sx={{ mt: 2 }}>{errorMessage}</Alert>}

            <Button
                variant="contained"
                sx={{
                    mt: 3, backgroundColor: 'primary.dark', color: 'primary.contrastText',
                    '&:hover': {
                        backgroundColor: 'primary.light'
                    }
                }}
                onClick={handleUpdateProfile}
                disabled={loading}
            >
                Atualizar dados
            </Button>

            {/* Seção de Alteração de Senha */}
            <Divider sx={{ my: 4 }} />
            <Typography variant="h6" gutterBottom>Alterar Senha</Typography>

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

            <Button
                variant="outlined"
                color="error"
                sx={{ mt: 2, display: 'block' }}
                onClick={onLogout}
                disabled={loading || passwordLoading}
            >
                Sair do perfil
            </Button>
        </Box>
    );
} 