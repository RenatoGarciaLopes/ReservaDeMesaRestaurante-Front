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
import type { SectionType } from './types';
import { SidebarMenu } from './SidebarMenu';
import { ProfileSection } from './sections/ProfileSection';
import { CategorySection } from './sections/CategorySection';
import { ManageMenuSection } from './sections/ManageMenuSection';

interface SettingsModalProps {
    open: boolean;
    onClose: () => void;
}

function SettingsModal({ open, onClose }: SettingsModalProps) {
    const { logout } = useAuth();
    const [currentSection, setCurrentSection] = useState<SectionType>('profile');

    // Reset states when modal opens
    useEffect(() => {
        if (open) {
            setCurrentSection('profile');
        }
    }, [open]);

    const handleLogout = () => {
        logout();
        onClose();
    };

    const renderSection = () => {
        switch (currentSection) {
            case 'profile':
                return <ProfileSection onLogout={handleLogout} />;
            case 'category':
                return <CategorySection />;
            case 'manageMenu':
                return <ManageMenuSection />;
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
                    Configurações
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

export default SettingsModal; 