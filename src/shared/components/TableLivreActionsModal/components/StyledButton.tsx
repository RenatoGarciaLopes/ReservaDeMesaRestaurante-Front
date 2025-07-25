import React from 'react';
import { Button } from '@mui/material';
import type { ButtonProps } from '@mui/material';

interface StyledButtonProps extends Omit<ButtonProps, 'variant'> {
    variant?: 'primary' | 'secondary' | 'danger';
    fullWidth?: boolean;
}

export function StyledButton({ 
    variant = 'primary', 
    fullWidth = true, 
    children, 
    sx, 
    ...props 
}: StyledButtonProps) {
    const getVariantStyles = () => {
        switch (variant) {
            case 'primary':
                return {
                    background: '#222',
                    color: '#fff',
                    '&:hover': { background: '#111' },
                    '&:disabled': { background: '#e0e0e0', color: '#888' }
                };
            case 'secondary':
                return {
                    background: '#f5f5f5',
                    color: '#333',
                    '&:hover': { background: '#e0e0e0' }
                };
            case 'danger':
                return {
                    background: '#d32f2f',
                    color: '#fff',
                    '&:hover': { background: '#b71c1c' }
                };
            default:
                return {};
        }
    };

    return (
        <Button
            variant="contained"
            fullWidth={fullWidth}
            sx={{
                borderRadius: 0,
                fontWeight: 700,
                fontSize: 15,
                height: 40,
                textTransform: 'uppercase',
                letterSpacing: 1,
                boxShadow: 'none',
                ...getVariantStyles(),
                ...sx
            }}
            {...props}
        >
            {children}
        </Button>
    );
} 