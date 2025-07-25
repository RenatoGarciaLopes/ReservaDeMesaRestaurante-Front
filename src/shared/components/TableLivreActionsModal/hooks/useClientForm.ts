import { useState } from 'react';

export function useClientForm() {
    const [clientName, setClientName] = useState('');
    const [clientCpf, setClientCpf] = useState('');
    const [clientEmail, setClientEmail] = useState('');
    const [clientPhone, setClientPhone] = useState('');
    const [clientObservations, setClientObservations] = useState('');

    const resetForm = () => {
        setClientName('');
        setClientCpf('');
        setClientEmail('');
        setClientPhone('');
        setClientObservations('');
    };

    const formatCpf = (value: string) => {
        const numericValue = value.replace(/\D/g, '');
        if (numericValue.length <= 3) return numericValue;
        if (numericValue.length <= 6) return `${numericValue.slice(0, 3)}.${numericValue.slice(3)}`;
        if (numericValue.length <= 9) return `${numericValue.slice(0, 3)}.${numericValue.slice(3, 6)}.${numericValue.slice(6)}`;
        return `${numericValue.slice(0, 3)}.${numericValue.slice(3, 6)}.${numericValue.slice(6, 9)}-${numericValue.slice(9, 11)}`;
    };

    const formatTelefone = (value: string) => {
        const numericValue = value.replace(/\D/g, '');
        if (numericValue.length <= 2) return numericValue;
        if (numericValue.length <= 7) return `(${numericValue.slice(0, 2)})${numericValue.slice(2)}`;
        if (numericValue.length <= 11) return `(${numericValue.slice(0, 2)})${numericValue.slice(2, 7)}-${numericValue.slice(7)}`;
        return `(${numericValue.slice(0, 2)})${numericValue.slice(2, 7)}-${numericValue.slice(7, 11)}`;
    };

    const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setClientCpf(formatCpf(e.target.value));
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setClientPhone(formatTelefone(e.target.value));
    };

    return {
        clientName,
        setClientName,
        clientCpf,
        setClientCpf,
        clientEmail,
        setClientEmail,
        clientPhone,
        setClientPhone,
        clientObservations,
        setClientObservations,
        resetForm,
        handleCpfChange,
        handlePhoneChange,
        formatCpf,
    };
} 