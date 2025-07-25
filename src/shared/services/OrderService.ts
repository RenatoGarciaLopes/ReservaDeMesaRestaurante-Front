import axios from 'axios';
import type { ListarPedidoDto, CadastrarPedidoDto, ItemQuantidadeDto, PedidoDetalhadoDto } from '../types/Order';

interface ApiResponse<T> {
  success: boolean;
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
  size: number;
  number: number;
}

const API_URL = 'http://localhost:8080/api/pedidos';

class OrderService {
  async criarPedido(dto: CadastrarPedidoDto): Promise<any> {
    const response = await axios.post<ApiResponse<any>>(API_URL, dto);
    if (response.data.error) throw new Error(response.data.error.message);
    return response.data.data;
  }

  async listarPedidosPorReserva(
    reservaId: number, 
    pagina: number = 0, 
    tamanho: number = 10
  ): Promise<PageResponse<ListarPedidoDto>> {
    const response = await axios.get<ApiResponse<PageResponse<ListarPedidoDto>>>(
      `${API_URL}/reserva/${reservaId}`,
      {
        params: { pagina, tamanho }
      }
    );
    if (response.data.error) throw new Error(response.data.error.message);
    return response.data.data;
  }

  async obterPedidoPorId(id: number): Promise<ListarPedidoDto> {
    const response = await axios.get<ApiResponse<ListarPedidoDto>>(`${API_URL}/${id}`);
    if (response.data.error) throw new Error(response.data.error.message);
    return response.data.data;
  }

  async listarPedidosDetalhadosPorReserva(
    reservaId: number, 
    pagina: number = 0, 
    tamanho: number = 10
  ): Promise<PageResponse<PedidoDetalhadoDto>> {
    const response = await axios.get<ApiResponse<PageResponse<PedidoDetalhadoDto>>>(
      `${API_URL}/reserva/${reservaId}/detalhes`,
      {
        params: { pagina, tamanho }
      }
    );
    if (response.data.error) throw new Error(response.data.error.message);
    return response.data.data;
  }
}

export default new OrderService(); 