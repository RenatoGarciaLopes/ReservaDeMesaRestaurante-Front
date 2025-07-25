import { useState } from 'react';
import type { ModalState } from '../types';

export function useModalState() {
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const resetState = () => {
        setLoading(false);
        setSuccessMessage(null);
        setErrorMessage(null);
    };

    const setState = (state: Partial<ModalState>) => {
        if (state.loading !== undefined) setLoading(state.loading);
        if (state.successMessage !== undefined) setSuccessMessage(state.successMessage);
        if (state.errorMessage !== undefined) setErrorMessage(state.errorMessage);
    };

    return {
        loading,
        successMessage,
        errorMessage,
        setLoading,
        setSuccessMessage,
        setErrorMessage,
        resetState,
        setState,
    };
} 