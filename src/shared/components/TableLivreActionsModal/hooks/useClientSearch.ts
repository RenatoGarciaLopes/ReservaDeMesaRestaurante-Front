import { useState, useEffect } from 'react';
import ClientService from '../../../services/ClientService';
import type { ListarClienteDto } from '../../../types/Client';

export function useClientSearch() {
    const [clientCpf, setClientCpf] = useState('');
    const [foundClient, setFoundClient] = useState<ListarClienteDto | null>(null);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const formatCpf = (value: string) => {
        const numericValue = value.replace(/\D/g, '');
        if (numericValue.length <= 3) return numericValue;
        if (numericValue.length <= 6) return `${numericValue.slice(0, 3)}.${numericValue.slice(3)}`;
        if (numericValue.length <= 9) return `${numericValue.slice(0, 3)}.${numericValue.slice(3, 6)}.${numericValue.slice(6)}`;
        return `${numericValue.slice(0, 3)}.${numericValue.slice(3, 6)}.${numericValue.slice(6, 9)}-${numericValue.slice(9, 11)}`;
    };

    const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formattedCpf = formatCpf(e.target.value);
        setClientCpf(formattedCpf);
        setFoundClient(null);
        setSuccessMessage(null);
        setErrorMessage(null);
    };

    // Busca automática de cliente ao digitar CPF
    useEffect(() => {
        const cleanCpf = clientCpf.replace(/\D/g, '');
        if (cleanCpf.length === 11) {
            (async () => {
                setLoading(true);
                setSuccessMessage(null);
                setErrorMessage(null);
                try {
                    const client = await ClientService.searchClientByCpf(cleanCpf);
                    if (client) {
                        setFoundClient(client);
                        setSuccessMessage(`Cliente "${client.nome}" encontrado!`);
                    } else {
                        setFoundClient(null);
                        setErrorMessage('Cliente não encontrado. Por favor, cadastre-o.');
                    }
                } catch (error: any) {
                    setFoundClient(null);
                    setErrorMessage('Erro ao buscar cliente.');
                } finally {
                    setLoading(false);
                }
            })();
        } else {
            setFoundClient(null);
            setSuccessMessage(null);
            setErrorMessage(null);
        }
    }, [clientCpf]);

    const resetSearch = () => {
        setClientCpf('');
        setFoundClient(null);
        setSuccessMessage(null);
        setErrorMessage(null);
    };

    return {
        clientCpf,
        foundClient,
        loading,
        successMessage,
        errorMessage,
        handleCpfChange,
        resetSearch,
        setFoundClient,
        setSuccessMessage,
        setErrorMessage,
    };
} 