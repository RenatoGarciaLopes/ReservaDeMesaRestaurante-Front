import axios from 'axios';

interface ListarItensDto {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  categoria: string;
  imagemUrl: string;
}

interface PageResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalElements: number;
  totalPages: number;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: {
    message: string;
    details: string;
  };
}

const API_URL = 'http://localhost:8080/api/itens';

class MenuItemService {
  async listarItens(
    pagina: number = 0,
    tamanho: number = 10,
    categoriaId?: number
  ): Promise<{ content: ListarItensDto[], totalElements: number, totalPages: number }> {
    const params: any = {
      pagina,
      tamanho,
    };
    
    if (categoriaId) {
      params.categoriaId = categoriaId;
    }

    const response = await axios.get<ApiResponse<PageResponse<ListarItensDto>>>(API_URL, { params });
    
    if (response.data.error) {
      throw new Error(response.data.error.message || "Erro ao listar itens.");
    }

    const pageData = response.data.data;
    return {
      content: pageData.content,
      totalElements: pageData.totalElements,
      totalPages: pageData.totalPages,
    };
  }

  async obterItemPorId(id: number): Promise<ListarItensDto> {
    const response = await axios.get<ApiResponse<ListarItensDto>>(`${API_URL}/${id}`);
    
    if (response.data.error) {
      throw new Error(response.data.error.message || "Erro ao obter item.");
    }

    return response.data.data;
  }
}

export default new MenuItemService(); 