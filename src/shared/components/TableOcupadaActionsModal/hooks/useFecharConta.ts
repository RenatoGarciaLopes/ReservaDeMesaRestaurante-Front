import { useState, useEffect } from 'react';
import type { Table } from '../../../types/Table';
import type { ListarFuncionarioDto } from '../../../types/Employee';
import type { ListarReservaDto } from '../../../types/Reservation';
import type { PedidoDetalhadoDto, PedidoItemDetalhadoDto } from '../../../types/Order';
import OrderService from '../../../services/OrderService';
import ReservationService from '../../../services/ReservationService';

interface UseFecharContaReturn {
  reserva: ListarReservaDto | null;
  pedidos: PedidoDetalhadoDto[];
  itensPedidos: PedidoItemDetalhadoDto[];
  valorTotal: number;
  loading: boolean;
  error: string | null;
  concluirConta: () => Promise<void>;
}

export function useFecharConta(
  table: Table | null,
  employee: ListarFuncionarioDto | null,
  onTableUpdate: () => void,
  onClose: () => void
): UseFecharContaReturn {
  const [reserva, setReserva] = useState<ListarReservaDto | null>(null);
  const [pedidos, setPedidos] = useState<PedidoDetalhadoDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Buscar reserva ativa da mesa (usando as reservas que já vêm na mesa)
  useEffect(() => {
    if (!table || !table.reservas) return;

    // Busca a reserva ativa entre as reservas da mesa
    const reservaAtiva = table.reservas.find(r => r.status === 'ATIVA');
    setReserva(reservaAtiva || null);
  }, [table]);

  // Buscar pedidos da reserva
  useEffect(() => {
    if (!reserva) return;

    const buscarPedidos = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await OrderService.listarPedidosDetalhadosPorReserva(reserva.id);
        setPedidos(response.content);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao buscar pedidos');
      } finally {
        setLoading(false);
      }
    };

    buscarPedidos();
  }, [reserva]);

  // Calcular itens e valor total
  const itensPedidos = pedidos.flatMap(pedido => pedido.itens || []).filter(item => item != null);
  const valorTotal = itensPedidos.reduce((total, item) => total + (item?.subTotal || 0), 0);

  // Função para concluir a conta
  const concluirConta = async () => {
    if (!reserva) return;

    try {
      setLoading(true);
      setError(null);
      await ReservationService.concluirReserva(reserva.id);
      onTableUpdate();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao concluir conta');
    } finally {
      setLoading(false);
    }
  };

  return {
    reserva,
    pedidos,
    itensPedidos,
    valorTotal,
    loading,
    error,
    concluirConta
  };
} 