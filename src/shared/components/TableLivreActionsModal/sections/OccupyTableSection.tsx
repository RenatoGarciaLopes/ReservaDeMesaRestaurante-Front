import React, { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    CircularProgress,
    Alert,
    MenuItem,
} from '@mui/material';
import ReservationService from '../../../services/ReservationService';
import TableService from '../../../services/TableService';
import { useClientSearch } from '../hooks/useClientSearch';
import type { Table } from '../../../types/Table';
import type { ListarFuncionarioDto } from '../../../types/Employee';
import axios from 'axios';

interface OccupyTableSectionProps {
    table: Table | null;
    employee: ListarFuncionarioDto | null;
    onTableUpdate: () => void;
    onNavigateToRegisterClient: () => void;
}

export function OccupyTableSection({
    table,
    employee,
    onTableUpdate,
    onNavigateToRegisterClient,
}: OccupyTableSectionProps) {
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [occupyQuantidadePessoas, setOccupyQuantidadePessoas] = useState<number | ''>(
        table?.capacity || ''
    );

    const {
        clientCpf,
        foundClient,
        loading: searchLoading,
        successMessage: searchSuccessMessage,
        errorMessage: searchErrorMessage,
        handleCpfChange,
    } = useClientSearch();

    const handleOccupyTable = async () => {
        setLoading(true);
        setSuccessMessage(null);
        setErrorMessage(null);

        if (!table) {
            setErrorMessage("Nenhuma mesa selecionada.");
            setLoading(false);
            return;
        }
        if (!foundClient) {
            setErrorMessage("Por favor, encontre ou cadastre um cliente antes de ocupar a mesa.");
            setLoading(false);
            return;
        }
        if (!occupyQuantidadePessoas || occupyQuantidadePessoas < 1) {
            setErrorMessage("Por favor, informe a quantidade de pessoas.");
            setLoading(false);
            return;
        }
        if (occupyQuantidadePessoas > table.capacity) {
            setErrorMessage(`A quantidade de pessoas excede a capacidade da mesa (${table.capacity}).`);
            setLoading(false);
            return;
        }
        if (!employee?.id) {
            setErrorMessage("Funcionário não logado. Faça login novamente.");
            setLoading(false);
            return;
        }

        try {
            // 1. Buscar horários disponíveis para hoje
            const currentDate = new Date();
            const dataReserva = currentDate.toISOString().split('T')[0];

            const horariosDisponiveis = await ReservationService.getAvailableTimes(table.id, dataReserva);

            if (!horariosDisponiveis || horariosDisponiveis.length === 0) {
                setErrorMessage("Não há horários disponíveis para esta mesa hoje.");
                setLoading(false);
                return;
            }

            // 2. Encontrar o horário mais próximo do momento atual
            const now = currentDate.toTimeString().substring(0, 5);
            const proximoHorario = horariosDisponiveis.find(horario => horario >= now) || horariosDisponiveis[0];

            // 3. Criar a reserva usando o horário encontrado
            const horaReservaFormatada = proximoHorario.slice(0, 5);

            const reservaData = {
                clienteId: foundClient.id,
                mesaId: table.id,
                funcionarioId: employee.id,
                dataReserva: dataReserva,
                horaReserva: horaReservaFormatada,
                quantidadePessoas: occupyQuantidadePessoas,
            };

            await ReservationService.createReservation(reservaData);
            await TableService.updateMesaStatus(table.id, 'Ocupada');

            setSuccessMessage(`Mesa ${table.number} ocupada com sucesso pelo cliente ${foundClient.nome}!`);
            onTableUpdate();
        } catch (error: any) {
            const backendErrorMessage = axios.isAxiosError(error) && error.response?.data?.message
                ? error.response.data.message
                : error.message;
            setErrorMessage(backendErrorMessage || "Erro ao ocupar mesa. Tente novamente.");
            console.error("Erro ao ocupar mesa:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Ocupar mesa: <b>nº: {table?.number} | {table?.capacity} Lugares</b>
            </Typography>
            
            <TextField
                margin="dense"
                fullWidth
                variant="outlined"
                value={clientCpf}
                onChange={handleCpfChange}
                placeholder="123.456.789-12"
                label="*Digite o CPF do cliente:"
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
            
            <TextField
                margin="dense"
                select
                fullWidth
                variant="outlined"
                value={occupyQuantidadePessoas}
                onChange={e => setOccupyQuantidadePessoas(Number(e.target.value) || '')}
                sx={{ mb: 2 }}
                label="*Coloque a quantidade de pessoas"
                SelectProps={{ displayEmpty: true }}
            >
                <MenuItem value="">Qnt. pessoas</MenuItem>
                {Array.from({ length: table?.capacity || 1 }, (_, i) => (
                    <MenuItem key={i + 1} value={i + 1}>{i + 1}</MenuItem>
                ))}
            </TextField>
            
            <Button
                variant="contained"
                sx={{ width: '100%' }}
                onClick={handleOccupyTable}
                disabled={loading || searchLoading || !foundClient || !occupyQuantidadePessoas || occupyQuantidadePessoas < 1}
            >
                Ocupar mesa
            </Button>
            
            {(loading || searchLoading) && <CircularProgress size={24} sx={{ mt: 2 }} />}
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