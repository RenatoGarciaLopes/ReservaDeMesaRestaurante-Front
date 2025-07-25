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
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ChairIcon from '@mui/icons-material/Chair';
import EventNoteIcon from '@mui/icons-material/EventNote';
import SettingsIcon from '@mui/icons-material/Settings';

type SectionType = 'occupyTable' | 'reserveTable' | 'registerClient' | 'tableSettings';

interface SidebarMenuProps {
    currentSection: SectionType;
    onSectionChange: (section: SectionType) => void;
}

export function SidebarMenu({ currentSection, onSectionChange }: SidebarMenuProps) {
    const menuItems = [
        {
            id: 'occupyTable' as SectionType,
            label: 'Ocupar mesa',
            icon: <ChairIcon />,
        },
        {
            id: 'reserveTable' as SectionType,
            label: 'Reservar mesa',
            icon: <EventNoteIcon />,
        },
        {
            id: 'registerClient' as SectionType,
            label: 'Cadastrar cliente',
            icon: <PersonAddIcon />,
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
                        {index === 2 && <Divider />}
                    </React.Fragment>
                ))}
            </List>
        </Box>
    );
} 