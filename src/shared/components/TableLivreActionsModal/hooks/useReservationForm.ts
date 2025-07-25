import { useState, useEffect } from 'react';
import { listarHorariosFuncionamento } from '../../../services/HorarioFuncionamentoService';
import ReservationService from '../../../services/ReservationService';
import type { ListarHorarioFuncionamento } from '../../../services/HorarioFuncionamentoService';
import type { Table } from '../../../types/Table';

export function useReservationForm(table: Table | null) {
    const [reserveClientCpf, setReserveClientCpf] = useState('');
    const [reserveDate, setReserveDate] = useState<string>('');
    const [reserveHour, setReserveHour] = useState('');
    const [reserveQuantidadePessoas, setReserveQuantidadePessoas] = useState<number | ''>('');
    const [diasFuncionamento, setDiasFuncionamento] = useState<ListarHorarioFuncionamento[]>([]);
    const [horariosDisponiveis, setHorariosDisponiveis] = useState<string[]>([]);

    // Preencher quantidade de pessoas com o valor máximo ao abrir a aba de reserva
    useEffect(() => {
        if (table?.capacity) {
            setReserveQuantidadePessoas(table.capacity);
        }
    }, [table]);

    // Buscar dias de funcionamento
    useEffect(() => {
        (async () => {
            try {
                const dias = await listarHorariosFuncionamento();
                setDiasFuncionamento(dias);
            } catch (e) {
                setDiasFuncionamento([]);
            }
        })();
    }, []);

    // Buscar horários disponíveis ao selecionar data
    useEffect(() => {
        async function fetchHorarios() {
            if (table && reserveDate) {
                setHorariosDisponiveis([]);
                try {
                    const horarios = await ReservationService.getAvailableTimes(table.id, reserveDate);
                    setHorariosDisponiveis(horarios);
                } catch (e) {
                    setHorariosDisponiveis([]);
                }
            }
        }
        fetchHorarios();
    }, [reserveDate, table]);

    const formatCpf = (value: string) => {
        const numericValue = value.replace(/\D/g, '');
        if (numericValue.length <= 3) return numericValue;
        if (numericValue.length <= 6) return `${numericValue.slice(0, 3)}.${numericValue.slice(3)}`;
        if (numericValue.length <= 9) return `${numericValue.slice(0, 3)}.${numericValue.slice(3, 6)}.${numericValue.slice(6)}`;
        return `${numericValue.slice(0, 3)}.${numericValue.slice(3, 6)}.${numericValue.slice(6, 9)}-${numericValue.slice(9, 11)}`;
    };

    const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setReserveClientCpf(formatCpf(e.target.value));
    };

    const resetForm = () => {
        setReserveClientCpf('');
        setReserveDate('');
        setReserveHour('');
        setReserveQuantidadePessoas(table?.capacity || '');
        setHorariosDisponiveis([]);
    };

    return {
        reserveClientCpf,
        reserveDate,
        setReserveDate,
        reserveHour,
        setReserveHour,
        reserveQuantidadePessoas,
        setReserveQuantidadePessoas,
        diasFuncionamento,
        horariosDisponiveis,
        handleCpfChange,
        resetForm,
    };
} 