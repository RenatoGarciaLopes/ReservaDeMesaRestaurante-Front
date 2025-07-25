import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    TextField,
    MenuItem,
} from '@mui/material';
import type { Table } from '../../../types/Table';
import TableService from '../../../services/TableService';

interface TableSettingsSectionProps {
    table: Table | null;
    onTableUpdate?: () => void;
}

export function TableSettingsSection({ table, onTableUpdate }: TableSettingsSectionProps) {
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [numero, setNumero] = useState('');
    const [capacidade, setCapacidade] = useState('');

    useEffect(() => {
        if (table) {
            setNumero(String(table.number));
            setCapacidade(String(table.capacity));
        }
    }, [table]);

    const handleUpdate = async () => {
        if (!table) return;
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            await TableService.updateMesaInfo(table.id, Number(numero), Number(capacidade));
            setSuccess('Dados da mesa atualizados com sucesso!');
            if (onTableUpdate) onTableUpdate();
        } catch (e: any) {
            setError(e.message || 'Erro ao atualizar mesa.');
        } finally {
            setLoading(false);
        }
    };

    const handleInativarMesa = async () => {
        if (!table) return;
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            await TableService.inativarMesa(table.id);
            setSuccess('Mesa inativada com sucesso!');
            setConfirmOpen(false);
            if (onTableUpdate) onTableUpdate();
        } catch (e: any) {
            setError(e.message || 'Erro ao inativar mesa.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <Typography variant="h6" gutterBottom>Configurações da mesa</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 700, width: '100%', mb: 2 }}>
                <TextField
                    label="nº da mesa"
                    value={numero}
                    onChange={e => setNumero(e.target.value.replace(/\D/g, ''))}
                    fullWidth
                    disabled={!table}
                    type="number"
                    inputProps={{ min: 1 }}
                    sx={{ width: '100%' }}
                />
                <TextField
                    label="Capacidade da mesa"
                    value={capacidade}
                    onChange={e => setCapacidade(e.target.value.replace(/\D/g, ''))}
                    fullWidth
                    disabled={!table}
                    type="number"
                    inputProps={{ min: 1 }}
                    sx={{ width: '100%' }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleUpdate}
                    disabled={loading || !numero || !capacidade || !table}
                    sx={{ width: '100%' }}
                >
                    Atualizar dados da mesa
                </Button>
                <Button
                    variant="contained"
                    color="error"
                    onClick={() => setConfirmOpen(true)}
                    disabled={!table || loading}
                    sx={{ width: '100%' }}
                >
                    Inativar mesa
                </Button>
            </Box>
            {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
                <DialogTitle>Confirmar inativação</DialogTitle>
                <DialogContent>
                    Tem certeza que deseja inativar a mesa <b>nº {table?.number}</b>?<br/>
                    Esta ação não poderá ser desfeita.
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmOpen(false)} disabled={loading}>Cancelar</Button>
                    <Button onClick={handleInativarMesa} color="error" disabled={loading}>
                        {loading ? 'Inativando...' : 'Confirmar'}
                    </Button>
                </DialogActions>
            </Dialog>
            <Typography variant="caption" display="block" sx={{ mt: 2, color: 'text.secondary' }}>
                *Só será possível inativar a mesa caso não haja nenhuma reserva associada a ela
            </Typography>
        </Box>
    );
} 