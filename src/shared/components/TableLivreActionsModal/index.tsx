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
import { OccupyTableSection } from './sections/OccupyTableSection';
import { ReserveTableSection } from './sections/ReserveTableSection';
import { RegisterClientSection } from './sections/RegisterClientSection';
import { TableSettingsSection } from './sections/TableSettingsSection';

interface TableLivreActionsModalProps {
    open: boolean;
    onClose: () => void;
    table: Table | null;
    onTableUpdate: () => void;
}



function TableLivreActionsModal({ open, onClose, table, onTableUpdate }: TableLivreActionsModalProps) {
    const { employee } = useAuth();
    const [currentSection, setCurrentSection] = useState<SectionType>('occupyTable');

    // Reset states when modal opens
    useEffect(() => {
        if (open) {
            setCurrentSection('occupyTable');
        }
    }, [open]);

    const renderSection = () => {
        switch (currentSection) {
            case 'occupyTable':
                return (
                    <OccupyTableSection
                        table={table}
                        employee={employee}
                        onTableUpdate={onTableUpdate}
                        onNavigateToRegisterClient={() => setCurrentSection('registerClient')}
                    />
                );
            case 'reserveTable':
                return (
                    <ReserveTableSection
                        table={table}
                        employee={employee}
                        onTableUpdate={onTableUpdate}
                        onNavigateToRegisterClient={() => setCurrentSection('registerClient')}
                    />
                );
            case 'registerClient':
                return (
                    <RegisterClientSection
                        onNavigateToOccupyTable={() => setCurrentSection('occupyTable')}
                    />
                );
            case 'tableSettings':
                return <TableSettingsSection table={table} />;
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

export default TableLivreActionsModal; 