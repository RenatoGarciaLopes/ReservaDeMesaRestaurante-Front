import React from 'react';
import { Alert, Box } from '@mui/material';

interface MessageDisplayProps {
    successMessage?: string | null;
    errorMessage?: string | null;
    sx?: any;
}

export function MessageDisplay({ successMessage, errorMessage, sx }: MessageDisplayProps) {
    if (!successMessage && !errorMessage) return null;

    return (
        <Box sx={sx}>
            {successMessage && <Alert severity="success" sx={{ mb: 1 }}>{successMessage}</Alert>}
            {errorMessage && <Alert severity="error" sx={{ mb: 1 }}>{errorMessage}</Alert>}
        </Box>
    );
} 