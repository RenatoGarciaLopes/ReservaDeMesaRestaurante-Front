import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Box,
    Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '../../context/AuthContext';
import type { Table } from '../../types/Table';
import type { SectionType } from './types';
import { SidebarMenu } from './SidebarMenu';
import { 
    FazerPedidoSection,
    FecharContaSection,
    TableSettingsSection
} from './sections';

interface TableOcupadaActionsModalProps {
    open: boolean;
    onClose: () => void;
    table: Table | null;
    onTableUpdate: () => void;
}

function TableOcupadaActionsModal({ open, onClose, table, onTableUpdate }: TableOcupadaActionsModalProps) {
    const { employee } = useAuth();
    const [currentSection, setCurrentSection] = useState<SectionType>('fazerPedido');

    // Reset states when modal opens
    useEffect(() => {
        if (open) {
            setCurrentSection('fazerPedido');
        }
    }, [open]);

    const renderSection = () => {
        switch (currentSection) {
            case 'fazerPedido':
                return (
                    <FazerPedidoSection
                        table={table}
                        employee={employee}
                        onTableUpdate={onTableUpdate}
                    />
                );
            case 'fecharConta':
                return (
                    <FecharContaSection
                        table={table}
                        employee={employee}
                        onTableUpdate={onTableUpdate}
                        onClose={onClose}
                    />
                );
            case 'tableSettings':
                return (
                    <TableSettingsSection
                        table={table}
                        onTableUpdate={onTableUpdate}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth={false}
            fullWidth
            PaperProps={{
                sx: {
                    width: 870,
                    height: 770,
                    maxWidth: '100%',
                    maxHeight: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                }
            }}
        >
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
            <DialogContent dividers sx={{ p: 0, flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', flex: 1, minHeight: 0 }}>
                    <SidebarMenu
                        currentSection={currentSection}
                        onSectionChange={setCurrentSection}
                    />
                    <Box sx={{ flexGrow: 1, p: 3, overflow: 'auto' }}>
                        {renderSection()}
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
}

export default TableOcupadaActionsModal; 