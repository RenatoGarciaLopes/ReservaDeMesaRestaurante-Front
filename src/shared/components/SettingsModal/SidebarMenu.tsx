import React from 'react';
import {
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import CategoryIcon from '@mui/icons-material/Category';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

import type { SectionType } from './types';

interface SidebarMenuProps {
    currentSection: SectionType;
    onSectionChange: (section: SectionType) => void;
}

export function SidebarMenu({ currentSection, onSectionChange }: SidebarMenuProps) {
    const menuItems = [
        {
            id: 'profile' as SectionType,
            label: 'Perfil',
            icon: <PersonIcon />,
        },
        {
            id: 'category' as SectionType,
            label: 'Categorias',
            icon: <CategoryIcon />,
        },
        {
            id: 'manageMenu' as SectionType,
            label: 'Gerenciar Cardápio',
            icon: <ManageAccountsIcon />,
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
                {menuItems.map((item) => (
                    <ListItem key={item.id} disablePadding>
                        <ListItemButton
                            onClick={() => onSectionChange(item.id)}
                            selected={currentSection === item.id}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.label} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
} 