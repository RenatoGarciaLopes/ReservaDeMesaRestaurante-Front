import React from 'react';
import {
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider,
} from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ReceiptIcon from '@mui/icons-material/Receipt';
import SettingsIcon from '@mui/icons-material/Settings';
import type { SectionType } from './types';

interface SidebarMenuProps {
    currentSection: SectionType;
    onSectionChange: (section: SectionType) => void;
}

export function SidebarMenu({ currentSection, onSectionChange }: SidebarMenuProps) {
    const menuItems = [
        {
            id: 'fazerPedido' as SectionType,
            label: 'Fazer pedido',
            icon: <RestaurantIcon />,
        },
        {
            id: 'fecharConta' as SectionType,
            label: 'Fechar conta',
            icon: <ReceiptIcon />,
        },
        {
            id: 'tableSettings' as SectionType,
            label: 'Configurações da mesa',
            icon: <SettingsIcon />,
        },
    ];

    return (
        <Box
            sx={{
                width: 200,
                flexShrink: 0,
                borderRight: '1px solid #e0e0e0',
                backgroundColor: '#f8f8f8',
            }}
        >
            <List>
                {menuItems.map((item, index) => (
                    <React.Fragment key={item.id}>
                        <ListItem disablePadding>
                            <ListItemButton
                                onClick={() => onSectionChange(item.id)}
                                selected={currentSection === item.id}
                            >
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.label} />
                            </ListItemButton>
                        </ListItem>
                        {index < menuItems.length - 1 && <Divider />}
                    </React.Fragment>
                ))}
            </List>
        </Box>
    );
} 