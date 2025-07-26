import axios from 'axios';
import type { ListarItensDto, CadastrarItensDto } from '../types/MenuItem';

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

  async cadastrarItem(dto: CadastrarItensDto): Promise<ListarItensDto> {
    const response = await axios.post<ApiResponse<ListarItensDto>>(API_URL, dto);
    
    if (response.data.error) {
      throw new Error(response.data.error.message || "Erro ao cadastrar item.");
    }

    return response.data.data;
  }

  async uploadImagem(itemId: number, imagem: File): Promise<string> {
    const formData = new FormData();
    formData.append('imagem', imagem);

    const response = await axios.post<ApiResponse<string>>(`${API_URL}/upload-imagem/${itemId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    if (response.data.error) {
      throw new Error(response.data.error.message || "Erro ao fazer upload da imagem.");
    }

    return response.data.data;
  }

  async updateItem(id: number, dto: Partial<CadastrarItensDto>): Promise<ListarItensDto> {
    const response = await axios.put<ApiResponse<ListarItensDto>>(`${API_URL}/${id}`, dto);
    
    if (response.data.error) {
      throw new Error(response.data.error.message || "Erro ao atualizar item.");
    }

    return response.data.data;
  }

  async inativarItem(id: number): Promise<string> {
    const response = await axios.delete<ApiResponse<string>>(`${API_URL}/${id}`);
    if (response.data.error) {
      throw new Error(response.data.error.message || "Erro ao inativar item.");
    }
    return response.data.data;
  }

  async reativarItem(id: number): Promise<string> {
    const response = await axios.patch<ApiResponse<string>>(`${API_URL}/${id}`);
    if (response.data.error) {
      throw new Error(response.data.error.message || "Erro ao reativar item.");
    }
    return response.data.data;
  }
}

export default new MenuItemService(); 