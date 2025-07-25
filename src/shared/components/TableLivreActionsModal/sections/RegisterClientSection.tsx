import React, { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    CircularProgress,
    Alert,
} from '@mui/material';
import ClientService from '../../../services/ClientService';
import { useClientForm } from '../hooks/useClientForm';
import axios from 'axios';

interface RegisterClientSectionProps {
    onNavigateToOccupyTable: () => void;
}

export function RegisterClientSection({ onNavigateToOccupyTable }: RegisterClientSectionProps) {
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const {
        clientName,
        setClientName,
        clientCpf,
        clientEmail,
        setClientEmail,
        clientPhone,
        clientObservations,
        setClientObservations,
        handleCpfChange,
        handlePhoneChange,
    } = useClientForm();

    const handleRegisterClient = async () => {
        setLoading(true);
        setSuccessMessage(null);
        setErrorMessage(null);

        if (!clientName || !clientCpf || !clientEmail || !clientPhone) {
            setErrorMessage('Por favor, preencha todos os campos obrigatórios.');
            setLoading(false);
            return;
        }

        try {
            const newClient = await ClientService.createClient({
                nome: clientName,
                cpf: clientCpf,
                email: clientEmail,
                telefone: clientPhone,
                observacoes: clientObservations,
            });
            setSuccessMessage(`Cliente ${newClient.nome} cadastrado com sucesso!`);
            // Opcional: pré-selecionar este cliente para ocupar/reservar
            setTimeout(() => {
                onNavigateToOccupyTable();
            }, 2000);
        } catch (error: any) {
            const backendErrorMessage = axios.isAxiosError(error) && error.response?.data?.message
                ? error.response.data.message
                : error.message;
            setErrorMessage(backendErrorMessage || 'Erro ao cadastrar cliente. Tente novamente.');
            console.error('Erro ao cadastrar cliente:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <Typography variant="h6" gutterBottom>Cadastrar Cliente</Typography>
            
            <TextField
                margin="dense"
                label="*Digite o nome do cliente:"
                fullWidth
                variant="outlined"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                required
                sx={{ mb: 2 }}
            />
            
            <TextField
                margin="dense"
                label="*Digite o CPF do cliente:"
                fullWidth
                variant="outlined"
                value={clientCpf}
                onChange={handleCpfChange}
                inputProps={{ maxLength: 14 }}
                required
                sx={{ mb: 2 }}
            />
            
            <TextField
                margin="dense"
                label="*Digite o e-mail do cliente:"
                fullWidth
                variant="outlined"
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                required
                sx={{ mb: 2 }}
            />
            
            <TextField
                margin="dense"
                label="*Digite o telefone do cliente:"
                fullWidth
                variant="outlined"
                value={clientPhone}
                onChange={handlePhoneChange}
                inputProps={{ maxLength: 15 }}
                required
                sx={{ mb: 2 }}
            />
            
            <TextField
                margin="dense"
                label="Observações:"
                fullWidth
                variant="outlined"
                multiline
                rows={3}
                value={clientObservations}
                onChange={(e) => setClientObservations(e.target.value)}
                sx={{ mb: 2 }}
            />

            {loading && <CircularProgress size={24} sx={{ mt: 2 }} />}
            {successMessage && <Alert severity="success" sx={{ mt: 2 }}>{successMessage}</Alert>}
            {errorMessage && <Alert severity="error" sx={{ mt: 2 }}>{errorMessage}</Alert>}

            <Button
                variant="contained"
                sx={{
                    mt: 3, 
                    backgroundColor: 'primary.dark', 
                    color: 'primary.contrastText',
                    '&:hover': {
                        backgroundColor: 'primary.light'
                    }
                }}
                onClick={handleRegisterClient}
                disabled={loading}
            >
                Cadastrar cliente
            </Button>
            
            <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
                *Preenchimento obrigatório
            </Typography>
        </Box>
    );
} 