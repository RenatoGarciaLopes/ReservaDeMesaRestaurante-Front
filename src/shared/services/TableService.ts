import axios from 'axios';
// Importa Table, TableStatusType e TableFilterStatus
import type { Table, TableStatusType, TableFilterStatus } from '../types/Table';
import type { ListarReservaDto } from '../types/Reservation';
import OrderService from './OrderService';
import ReservationService from './ReservationService';

interface ListarMesaDto {
  id: number;
  numero: number;
  capacidade: number;
  status: 'LIVRE' | 'OCUPADO' | 'RESERVADA';
  ativo: boolean;
  reservas?: ListarReservaDto[]; // Lista de reservas associadas à mesa
}

interface ApiResponse<T> {
  data: T;
  error?: {
    message: string;
    details: string;
  };
}

interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

const API_URL = 'http://localhost:8080/api/mesas';

class TableService {
  // Mapeamento: Backend para Frontend (retorna TableStatusType)
  private mapBackendStatusToFrontend(backendStatus: 'LIVRE' | 'OCUPADO' | 'RESERVADA'): TableStatusType {
    switch (backendStatus) {
      case 'LIVRE': return 'Livre';
      case 'OCUPADO': return 'Ocupada';
      case 'RESERVADA': return 'Reservada';
      default: return 'Livre';
    }
  }

  // Mapeamento: Frontend Filter para Backend Status (aceita TableFilterStatus)
  private mapFrontendFilterToBackendStatus(frontendFilterStatus: TableFilterStatus): 'LIVRE' | 'OCUPADO' | 'RESERVADA' {
    switch (frontendFilterStatus) {
      case 'Livre': return 'LIVRE';
      case 'Ocupada': return 'OCUPADO';
      case 'Reservada': return 'RESERVADA';
      // Não há um mapeamento direto para 'Todos' aqui, pois não é um status real de mesa
      default: return 'LIVRE';
    }
  }

  /**
   * Busca o total gasto em uma mesa ocupada
   * @param mesaId ID da mesa
   * @returns Promise<number> - Total gasto na mesa
   */
  private async getTotalGastoPorMesa(mesaId: number): Promise<number> {
    try {
      // Buscar reserva ativa da mesa
      const reservaAtiva = await this.getReservaAtivaPorMesa(mesaId);
      if (!reservaAtiva) return 0;

      // Buscar pedidos da reserva
      const response = await OrderService.listarPedidosDetalhadosPorReserva(reservaAtiva.id);
      const pedidos = response.content;

      // Calcular total gasto baseado nos itens dos pedidos (mesma lógica do useFecharConta)
      const itensPedidos = pedidos.flatMap(pedido => pedido.itens || []).filter(item => item != null);
      const totalGasto = itensPedidos.reduce((total, item) => total + (item?.subTotal || 0), 0);

      return totalGasto;
    } catch (error) {
      console.error('Erro ao buscar total gasto da mesa:', error);
      return 0;
    }
  }

  /**
   * Busca a reserva ativa de uma mesa
   * @param mesaId ID da mesa
   * @returns Promise<ListarReservaDto | null>
   */
  private async getReservaAtivaPorMesa(mesaId: number): Promise<ListarReservaDto | null> {
    try {
      return await ReservationService.getReservaAtivaPorMesa(mesaId);
    } catch (error) {
      console.error('Erro ao buscar reserva ativa da mesa:', error);
      return null;
    }
  }

  async getMesasPaginated(
    pagina: number = 0,
    tamanho: number = 0,
    status?: TableFilterStatus, // O parâmetro de filtro é TableFilterStatus
    capacidade?: number,
    ativo?: boolean
  ): Promise<{ content: Table[], totalElements: number, totalPages: number }> {
    const params: any = {
      pagina,
      tamanho,
    };
    // Apenas mapeia para o backend se o status não for 'Todos'
    if (status && status !== 'Todos') {
      params.status = this.mapFrontendFilterToBackendStatus(status);
    }
    if (capacidade !== undefined) {
      params.capacidade = capacidade;
    }
    if (ativo !== undefined) {
      params.ativo = ativo;
    }

    const response = await axios.get<ApiResponse<PageResponse<ListarMesaDto>>>(API_URL, { params });

    if (response.data.error) {
      throw new Error(response.data.error.message || "Erro desconhecido ao listar mesas.");
    }

    const pageData = response.data.data;
    
    // Mapear mesas e buscar total gasto para mesas ocupadas
    const mappedContent: Table[] = await Promise.all(
      pageData.content.map(async (mesaDto) => {
        const status = this.mapBackendStatusToFrontend(mesaDto.status);
        let totalOrder: number | undefined = undefined;

        // Buscar total gasto apenas para mesas ocupadas
        if (status === 'Ocupada') {
          totalOrder = await this.getTotalGastoPorMesa(mesaDto.id);
        }

        return {
          id: mesaDto.id,
          number: mesaDto.numero,
          capacity: mesaDto.capacidade,
          status,
          active: mesaDto.ativo,
          reservas: mesaDto.reservas,
          totalOrder,
        };
      })
    );

    return {
      content: mappedContent,
      totalElements: pageData.totalElements,
      totalPages: pageData.totalPages,
    };
  }

  async createMesa(numero: number, capacidade: number): Promise<Table> {
    const dataToSend = { numero, capacidade };
    const response = await axios.post<ApiResponse<ListarMesaDto>>(API_URL, dataToSend);
    if (response.data.error) {
      throw new Error(response.data.error.message || "Erro desconhecido ao criar mesa.");
    }
    const createdMesaDto = response.data.data;
    return {
      id: createdMesaDto.id,
      number: createdMesaDto.numero,
      capacity: createdMesaDto.capacidade,
      status: this.mapBackendStatusToFrontend(createdMesaDto.status),
      active: createdMesaDto.ativo,
      reservas: createdMesaDto.reservas,
    };
  }

  // updateMesaStatus agora espera um TableStatusType para o novo status
  async updateMesaStatus(id: number, newStatus: TableStatusType): Promise<Table> {
    const dataToSend = { status: this.mapFrontendFilterToBackendStatus(newStatus) }; // Mapeia o status real
    const response = await axios.patch<ApiResponse<ListarMesaDto>>(`${API_URL}/${id}/status`, dataToSend);
    if (response.data.error) {
      throw new Error(response.data.error.message || "Erro desconhecido ao atualizar status da mesa.");
    }
    const updatedMesaDto = response.data.data;
    return {
      id: updatedMesaDto.id,
      number: updatedMesaDto.numero,
      capacity: updatedMesaDto.capacidade,
      status: this.mapBackendStatusToFrontend(updatedMesaDto.status),
      active: updatedMesaDto.ativo,
      reservas: updatedMesaDto.reservas,
    };
  }

  async updateMesaInfo(id: number, numero: number, capacidade: number): Promise<Table> {
    const dataToSend = { numero, capacidade };
    const response = await axios.put<ApiResponse<ListarMesaDto>>(`${API_URL}/${id}`, dataToSend);
    if (response.data.error) {
      throw new Error(response.data.error.message || "Erro desconhecido ao atualizar mesa.");
    }
    const updatedMesaDto = response.data.data;
    return {
      id: updatedMesaDto.id,
      number: updatedMesaDto.numero,
      capacity: updatedMesaDto.capacidade,
      status: this.mapBackendStatusToFrontend(updatedMesaDto.status),
      active: updatedMesaDto.ativo,
      reservas: updatedMesaDto.reservas,
    };
  }

  async inativarMesa(id: number): Promise<void> {
    const response = await axios.delete<ApiResponse<string>>(`${API_URL}/${id}`);
    if (response.data.error) {
      throw new Error(response.data.error.message || "Erro desconhecido ao inativar mesa.");
    }
  }

  async reativarMesa(id: number): Promise<void> {
    const response = await axios.patch<ApiResponse<string>>(`${API_URL}/${id}`);
    if (response.data.error) {
      throw new Error(response.data.error.message || "Erro desconhecido ao reativar mesa.");
    }
  }
}

export default new TableService();