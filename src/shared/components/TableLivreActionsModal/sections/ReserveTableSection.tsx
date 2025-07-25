import React from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    MenuItem,
    Alert,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useReservationForm } from '../hooks/useReservationForm';
import { useClientSearch } from '../hooks/useClientSearch';
import type { Table } from '../../../types/Table';
import type { ListarFuncionarioDto } from '../../../types/Employee';
import ReservationService from '../../../services/ReservationService';
import TableService from '../../../services/TableService';
import axios from 'axios';

interface ReserveTableSectionProps {
    table: Table | null;
    employee: ListarFuncionarioDto | null;
    onTableUpdate: () => void;
    onNavigateToRegisterClient: () => void;
}

export function ReserveTableSection({
    table,
    employee,
    onTableUpdate,
    onNavigateToRegisterClient,
}: ReserveTableSectionProps) {
    const {
        reserveClientCpf,
        reserveDate,
        setReserveDate,
        reserveHour,
        setReserveHour,
        reserveQuantidadePessoas,
        setReserveQuantidadePessoas,
        diasFuncionamento,
        horariosDisponiveis,
        // Remover handleCpfChange daqui
    } = useReservationForm(table);

    const {
        clientCpf,
        foundClient,
        loading: searchLoading,
        successMessage: searchSuccessMessage,
        errorMessage: searchErrorMessage,
        handleCpfChange, // Usar este handleCpfChange
    } = useClientSearch();

    const [loading, setLoading] = React.useState(false);
    const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

    // Função para mapear dia da semana em português
    const diasSemana = [
        'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'
    ];

    const isDateAllowed = (date: Date) => {
        const today = new Date();
        today.setHours(0,0,0,0);
        if (date < today) return false;
        const dia = diasSemana[date.getDay()];
        return diasFuncionamento.some(d => d.diaFuncionamento === dia);
    };

    const handleReserveTable = async () => {
        setLoading(true);
        setSuccessMessage(null);
        setErrorMessage(null);

        if (!table) {
            setErrorMessage('Nenhuma mesa selecionada.');
            setLoading(false);
            return;
        }
        if (!foundClient) {
            setErrorMessage('Por favor, encontre ou cadastre um cliente antes de reservar a mesa.');
            setLoading(false);
            return;
        }
        if (!reserveDate) {
            setErrorMessage('Por favor, selecione a data da reserva.');
            setLoading(false);
            return;
        }
        if (!reserveHour) {
            setErrorMessage('Por favor, selecione o horário da reserva.');
            setLoading(false);
            return;
        }
        if (!reserveQuantidadePessoas || reserveQuantidadePessoas < 1) {
            setErrorMessage('Por favor, informe a quantidade de pessoas.');
            setLoading(false);
            return;
        }
        if (reserveQuantidadePessoas > (table.capacity || 99)) {
            setErrorMessage(`A quantidade de pessoas excede a capacidade da mesa (${table.capacity}).`);
            setLoading(false);
            return;
        }
        if (!employee?.id) {
            setErrorMessage('Funcionário não logado. Faça login novamente.');
            setLoading(false);
            return;
        }

        try {
            const reservaData = {
                clienteId: foundClient.id,
                mesaId: table.id,
                funcionarioId: employee.id,
                dataReserva: reserveDate,
                horaReserva: reserveHour,
                quantidadePessoas: reserveQuantidadePessoas,
            };
            await ReservationService.createReservation(reservaData);
            await TableService.updateMesaStatus(table.id, 'Reservada');
            setSuccessMessage(`Mesa ${table.number} reservada com sucesso para o cliente ${foundClient.nome}!`);
            onTableUpdate();
        } catch (error: any) {
            const backendErrorMessage = axios.isAxiosError(error) && error.response?.data?.message
                ? error.response.data.message
                : error.message;
            setErrorMessage(backendErrorMessage || 'Erro ao reservar mesa. Tente novamente.');
            console.error('Erro ao reservar mesa:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Reservar mesa: <b>nº: {table?.number} | {table?.capacity} Lugares</b>
            </Typography>
            
            <TextField
                margin="dense"
                label="*Digite o CPF do cliente:"
                fullWidth
                variant="outlined"
                value={clientCpf} // Usar clientCpf
                onChange={handleCpfChange} // Usar handleCpfChange do useClientSearch
                inputProps={{ maxLength: 14 }}
                sx={{ mb: 2 }}
            />
            
            <Typography align="center" sx={{ my: 1 }}>Ou</Typography>
            
            <Button
                variant="contained"
                sx={{ mb: 2, width: '100%' }}
                onClick={onNavigateToRegisterClient}
            >
                Cadastre um novo cliente
            </Button>
            
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <DatePicker
                    label="*Data :"
                    value={reserveDate ? new Date(reserveDate + 'T00:00:00') : null}
                    onChange={date => setReserveDate(date ? date.toISOString().split('T')[0] : '')}
                    shouldDisableDate={date => !isDateAllowed(date)}
                    slotProps={{ 
                        textField: { 
                            fullWidth: true, 
                            InputLabelProps: { shrink: true }, 
                            sx: { flex: 1 } 
                        } 
                    }}
                />
                <TextField
                    label="*Hora:"
                    select
                    fullWidth
                    value={reserveHour}
                    onChange={e => setReserveHour(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    sx={{ flex: 1 }}
                    disabled={!reserveDate || horariosDisponiveis.length === 0}
                >
                    <MenuItem value="">Selecione o horário</MenuItem>
                    {horariosDisponiveis.map((h, idx) => (
                        <MenuItem key={idx} value={h.slice(0,5)}>{h.slice(0,5)}</MenuItem>
                    ))}
                </TextField>
            </Box>
            
            <TextField
                margin="dense"
                label="*Coloque a quantidade de pessoas"
                select
                fullWidth
                variant="outlined"
                value={reserveQuantidadePessoas}
                onChange={e => setReserveQuantidadePessoas(Number(e.target.value) || '')}
                inputProps={{ min: 1, max: table?.capacity || 99 }}
                sx={{ mb: 2 }}
                SelectProps={{ displayEmpty: true }}
            >
                {Array.from({ length: table?.capacity || 1 }, (_, i) => (
                    <MenuItem key={i + 1} value={i + 1}>{i + 1}</MenuItem>
                ))}
            </TextField>
            
            <Button
                variant="contained"
                sx={{ width: '100%' }}
                disabled={!foundClient || !reserveDate || !reserveHour || !reserveQuantidadePessoas || loading}
                onClick={handleReserveTable}
            >
                Reservar mesa
            </Button>
            {successMessage && <Alert severity="success" sx={{ mt: 2 }}>{successMessage}</Alert>}
            {errorMessage && <Alert severity="error" sx={{ mt: 2 }}>{errorMessage}</Alert>}
            {searchSuccessMessage && <Alert severity="success" sx={{ mt: 2 }}>{searchSuccessMessage}</Alert>}
            {searchErrorMessage && <Alert severity="error" sx={{ mt: 2 }}>{searchErrorMessage}</Alert>}
            
            <Typography variant="caption" display="block" sx={{ mt: 2, color: 'text.secondary', textAlign: 'right' }}>
                *Preenchimento obrigatório
            </Typography>
        </Box>
    );
} 