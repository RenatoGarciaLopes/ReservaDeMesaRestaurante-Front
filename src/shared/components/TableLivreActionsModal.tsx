// src/shared/components/TableLivreActionsModal.tsx (anteriormente TableActionsModal.tsx)

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
    CircularProgress,
    Alert,
    InputAdornment, // Para o ícone de busca no TextField
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ChairIcon from '@mui/icons-material/Chair';
import EventNoteIcon from '@mui/icons-material/EventNote';
import SettingsIcon from '@mui/icons-material/Settings';
import SearchIcon from '@mui/icons-material/Search'; // Ícone de busca

import ClientService from '../services/ClientService';
import ReservationService from '../services/ReservationService'; // Adicione esta importação
import TableService from '../services/TableService'; // Para mudar o status da mesa
import { useAuth } from '../context/AuthContext'; // Para pegar o ID do funcionário
import type { Table } from '../types/Table';
import type { ListarClienteDto } from '../types/Client'; // Importa ListarClienteDto
import axios from 'axios';

interface TableLivreActionsModalProps {
    open: boolean;
    onClose: () => void;
    table: Table | null;
    onTableUpdate: () => void;
}

function TableLivreActionsModal({ open, onClose, table, onTableUpdate }: TableLivreActionsModalProps) {
    const { employee } = useAuth(); // Pega o funcionário logado

    const [currentSection, setCurrentSection] = useState('occupyTable'); // Alterado para iniciar em 'Ocupar mesa'
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Estados para o formulário de Cadastrar Cliente
    const [clientName, setClientName] = useState('');
    const [clientCpf, setClientCpf] = useState('');
    const [clientEmail, setClientEmail] = useState('');
    const [clientPhone, setClientPhone] = useState('');
    const [clientObservations, setClientObservations] = useState('');

    // ESTADOS PARA OCUPAR MESA
    const [occupyClientCpf, setOccupyClientCpf] = useState('');
    const [foundClient, setFoundClient] = useState<ListarClienteDto | null>(null);
    const [occupyQuantidadePessoas, setOccupyQuantidadePessoas] = useState<number | ''>(table?.capacity || '');


    useEffect(() => {
        if (open) {
            setLoading(false);
            setSuccessMessage(null);
            setErrorMessage(null);
            // Resetar formulário de cadastro de cliente
            setClientName('');
            setClientCpf('');
            setClientEmail('');
            setClientPhone('');
            setClientObservations('');
            // Resetar formulário de ocupar mesa
            setOccupyClientCpf('');
            setFoundClient(null);
            setOccupyQuantidadePessoas(table?.capacity || ''); // Sugere capacidade da mesa
            setCurrentSection('occupyTable'); // Volta para a seção padrão
        }
    }, [open, table]);

    // Funções de formatação para CPF e Telefone (mantidas como estão)
    const formatCpf = (value: string) => {
        const numericValue = value.replace(/\D/g, '');
        if (numericValue.length <= 3) return numericValue;
        if (numericValue.length <= 6) return `${numericValue.slice(0, 3)}.${numericValue.slice(3)}`;
        if (numericValue.length <= 9) return `${numericValue.slice(0, 3)}.${numericValue.slice(3, 6)}.${numericValue.slice(6)}`;
        return `${numericValue.slice(0, 3)}.${numericValue.slice(3, 6)}.${numericValue.slice(6, 9)}-${numericValue.slice(9, 11)}`;
    };

    const formatTelefone = (value: string) => {
        const numericValue = value.replace(/\D/g, '');
        if (numericValue.length <= 2) return numericValue;
        if (numericValue.length <= 7) return `(${numericValue.slice(0, 2)})${numericValue.slice(2)}`;
        if (numericValue.length <= 11) return `(${numericValue.slice(0, 2)})${numericValue.slice(2, 7)}-${numericValue.slice(7)}`;
        return `(${numericValue.slice(0, 2)})${numericValue.slice(2, 7)}-${numericValue.slice(7, 11)}`;
    };

    const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setClientCpf(formatCpf(e.target.value));
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setClientPhone(formatTelefone(e.target.value));
    };

    const handleOccupyCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOccupyClientCpf(formatCpf(e.target.value));
        setFoundClient(null); // Reseta o cliente encontrado ao digitar
    };


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
            setFoundClient(newClient);
            setOccupyClientCpf(newClient.cpf);
            setCurrentSection('occupyTable'); // Sugere ir para ocupar a mesa
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

    // NOVA FUNÇÃO: Busca cliente por CPF na seção Ocupar Mesa
    const handleSearchClientForOccupy = async () => {
        setLoading(true);
        setSuccessMessage(null);
        setErrorMessage(null);
        setFoundClient(null); // Limpa cliente anterior

        const cleanCpf = occupyClientCpf.replace(/\D/g, '');
        if (!cleanCpf || cleanCpf.length !== 11) {
            setErrorMessage("Por favor, digite um CPF válido.");
            setLoading(false);
            return;
        }

        try {
            const client = await ClientService.searchClientByCpf(cleanCpf);
            if (client) {
                setFoundClient(client);
                setSuccessMessage(`Cliente "${client.nome}" encontrado!`);
            } else {
                setErrorMessage("Cliente não encontrado. Por favor, cadastre-o.");
            }
        } catch (error: any) {
            const backendErrorMessage = axios.isAxiosError(error) && error.response?.data?.message
                ? error.response.data.message
                : error.message;
            setErrorMessage(backendErrorMessage || "Erro ao buscar cliente.");
            console.error("Erro ao buscar cliente:", error);
        } finally {
            setLoading(false);
        }
    };

    // NOVA FUNÇÃO: Ocupar a Mesa
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
        if (!employee?.id) { // Verifica se há funcionário logado
            setErrorMessage("Funcionário não logado. Faça login novamente.");
            setLoading(false);
            return;
        }

        try {
            // 1. Criar a Reserva para a ocupação imediata
            const currentDateTime = new Date();
            const dataReserva = currentDateTime.toISOString().split('T')[0]; // Formato YYYY-MM-DD
            const horaReserva = currentDateTime.toTimeString().split(' ')[0].substring(0, 5); // Formato HH:mm

            const reservaData = {
                clienteId: foundClient.id,
                mesaId: table.id,
                funcionarioId: employee.id, // ID do funcionário logado
                dataReserva: dataReserva,
                horaReserva: horaReserva,
                quantidadePessoas: occupyQuantidadePessoas,
            };
            console.log("Dados da reserva sendo enviados:", reservaData); 

            const createdReserva = await ReservationService.createReservation(reservaData);

            // 2. Mudar o status da mesa para OCUPADA (já que ReservaService.salvar no backend pode deixar como RESERVADA)
            // Se seu backend já faz isso no salvar ou no confirmarChegada, pode ajustar
            await TableService.updateMesaStatus(table.id, 'Ocupada');

            setSuccessMessage(`Mesa ${table.number} ocupada com sucesso pelo cliente ${foundClient.nome}!`);
            onTableUpdate(); // Atualiza a lista de mesas na TablesPage
            // onClose(); // Opcional: fechar o modal após sucesso
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
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" component="div">
                    Ações para Mesa {table?.number}
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
                <Box sx={{ display: 'flex', minHeight: 400 }}>
                    {/* Menu Lateral de Ações */}
                    <Box
                        sx={{
                            width: 200,
                            flexShrink: 0,
                            borderRight: '1px solid #e0e0e0',
                            backgroundColor: '#f8f8f8',
                        }}
                    >
                        <List>
                            {/* Ocupar Mesa */}
                            <ListItem disablePadding>
                                <ListItemButton onClick={() => setCurrentSection('occupyTable')} selected={currentSection === 'occupyTable'}>
                                    <ListItemIcon>
                                        <ChairIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Ocupar mesa" />
                                </ListItemButton>
                            </ListItem>

                            {/* Reservar Mesa (Placeholder) */}
                            <ListItem disablePadding>
                                <ListItemButton onClick={() => setCurrentSection('reserveTable')} selected={currentSection === 'reserveTable'}>
                                    <ListItemIcon>
                                        <EventNoteIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Reservar mesa" />
                                </ListItemButton>
                            </ListItem>

                            {/* Cadastrar Cliente */}
                            <ListItem disablePadding>
                                <ListItemButton onClick={() => setCurrentSection('registerClient')} selected={currentSection === 'registerClient'}>
                                    <ListItemIcon>
                                        <PersonAddIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Cadastrar cliente" />
                                </ListItemButton>
                            </ListItem>

                            <Divider />

                            {/* Configurações da Mesa (Placeholder) */}
                            <ListItem disablePadding>
                                <ListItemButton onClick={() => setCurrentSection('tableSettings')} selected={currentSection === 'tableSettings'}>
                                    <ListItemIcon>
                                        <SettingsIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Configurações da mesa" />
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </Box>

                    {/* Conteúdo da Seção Selecionada */}
                    <Box sx={{ flexGrow: 1, p: 3 }}>
                        {currentSection === 'occupyTable' && (
                            <Box>
                                <Typography variant="h6" gutterBottom>Ocupar Mesa {table?.number}</Typography>
                                {table?.status !== 'Livre' && (
                                    <Alert severity="warning" sx={{ mb: 2 }}>Esta mesa não está livre. Ocupá-la forçará a mudança de status.</Alert>
                                )}
                                <TextField
                                    margin="dense"
                                    label="CPF do Cliente"
                                    fullWidth
                                    variant="outlined"
                                    value={occupyClientCpf}
                                    onChange={handleOccupyCpfChange}
                                    inputProps={{ maxLength: 14 }}
                                    sx={{ mb: 2 }}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={handleSearchClientForOccupy} disabled={loading}>
                                                    <SearchIcon />
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                {foundClient && (
                                    <Alert severity="info" sx={{ mb: 2 }}>
                                        Cliente encontrado: **{foundClient.nome}**
                                        <br />Email: {foundClient.email}
                                        <br />Telefone: {foundClient.telefone}
                                    </Alert>
                                )}
                                {foundClient === null && occupyClientCpf.replace(/\D/g, '').length === 11 && !loading && errorMessage && !errorMessage.includes("Por favor, digite um CPF válido.") && (
                                    <Alert severity="warning" sx={{ mb: 2 }}>
                                        Cliente não encontrado. <Button size="small" onClick={() => setCurrentSection('registerClient')}>Cadastrar novo cliente?</Button>
                                    </Alert>
                                )}

                                <TextField
                                    margin="dense"
                                    label="Quantidade de Pessoas"
                                    fullWidth
                                    variant="outlined"
                                    type="number"
                                    value={occupyQuantidadePessoas}
                                    onChange={(e) => setOccupyQuantidadePessoas(Number(e.target.value) || '')}
                                    inputProps={{ min: 1, max: table?.capacity || 99 }}
                                    required
                                    sx={{ mb: 2 }}
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
                                    onClick={handleOccupyTable}
                                    disabled={loading || !foundClient || !occupyQuantidadePessoas || occupyQuantidadePessoas < 1}
                                >
                                    Ocupar Mesa
                                </Button>
                            </Box>
                        )}

                        {currentSection === 'reserveTable' && (
                            <Box>
                                <Typography variant="h6" gutterBottom>Reservar Mesa</Typography>
                                <Typography>Funcionalidade para reservar a mesa.</Typography>
                                {/* Aqui virá o formulário/lógica para reservar a mesa */}
                            </Box>
                        )}

                        {currentSection === 'registerClient' && (
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
                                        mt: 3, backgroundColor: 'primary.dark', color: 'primary.contrastText',
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
                        )}

                        {currentSection === 'tableSettings' && (
                            <Box>
                                <Typography variant="h6" gutterBottom>Configurações da Mesa</Typography>
                                <Typography>Funcionalidade para configurar a mesa.</Typography>
                            </Box>
                        )}
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
}

export default TableLivreActionsModal;