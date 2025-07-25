import React from 'react';
import {
    Box,
    Typography,
    Table as MuiTable,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    Button,
    CircularProgress,
    Alert
} from '@mui/material';
import type { Table } from '../../../types/Table';
import type { ListarFuncionarioDto } from '../../../types/Employee';
import { useFecharConta } from '../hooks/useFecharConta';

interface FecharContaSectionProps {
    table: Table | null;
    employee: ListarFuncionarioDto | null;
    onTableUpdate: () => void;
    onClose: () => void;
}

export function FecharContaSection({ table, employee, onTableUpdate, onClose }: FecharContaSectionProps) {
    const {
        reserva,
        pedidos,
        itensPedidos,
        valorTotal,
        loading,
        error,
        concluirConta
    } = useFecharConta(table, employee, onTableUpdate, onClose);

    if (loading && !reserva) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box>
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            </Box>
        );
    }

    if (!reserva) {
        return (
            <Box>
                <Typography variant="h6" gutterBottom>Fechar conta</Typography>
                <Typography color="text.secondary">
                    Nenhuma reserva ativa encontrada para esta mesa.
                </Typography>
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h6" gutterBottom>Fechar conta</Typography>
            
            {/* Informações da mesa e cliente */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="body1" gutterBottom>
                    nº: {table?.number} | {table?.capacity} Lugares
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Pedidos realizados por {pedidos[0]?.nomeCliente || 'Cliente'}
                </Typography>
            </Box>

            {/* Tabela de pedidos */}
            <TableContainer component={Paper} sx={{ mb: 3 }}>
                <MuiTable>
                    <TableHead>
                        <TableRow>
                            <TableCell>Produto</TableCell>
                            <TableCell align="center">Qtde</TableCell>
                            <TableCell align="right">Unitário</TableCell>
                            <TableCell align="right">Total</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {itensPedidos.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    <Typography color="text.secondary">
                                        Nenhum pedido encontrado
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            itensPedidos
                                .filter(item => item && item.nomeItem)
                                .map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{item.nomeItem}</TableCell>
                                        <TableCell align="center">{item.quantidade}x</TableCell>
                                        <TableCell align="right">
                                            R$ {item.valorUnitario.toFixed(2).replace('.', ',')}
                                        </TableCell>
                                        <TableCell align="right">
                                            R$ {item.subTotal.toFixed(2).replace('.', ',')}
                                        </TableCell>
                                    </TableRow>
                                ))
                        )}
                    </TableBody>
                </MuiTable>
            </TableContainer>

            {/* Valor total */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="body1" gutterBottom>
                    Valor total:
                </Typography>
                <TextField
                    fullWidth
                    value={`R$ ${valorTotal.toFixed(2).replace('.', ',')}`}
                    InputProps={{
                        readOnly: true,
                        sx: { fontWeight: 'bold', fontSize: '1.1rem' }
                    }}
                />
            </Box>

            {/* Botão fechar conta */}
            <Button
                variant="contained"
                fullWidth
                onClick={concluirConta}
                disabled={loading || itensPedidos.length === 0}
                sx={{
                    backgroundColor: '#424242',
                    '&:hover': {
                        backgroundColor: '#616161'
                    }
                }}
            >
                {loading ? <CircularProgress size={20} color="inherit" /> : 'Fechar conta'}
            </Button>
        </Box>
    );
} 