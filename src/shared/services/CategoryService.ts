import axios from 'axios';

interface ListarCategoriaDto {
  id: number;
  nome: string;
  descricao?: string;
  ativo: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: {
    message: string;
    details: string;
  };
}

const API_URL = 'http://localhost:8080/api/categorias';

class CategoryService {
  async listarCategorias(ativo?: boolean): Promise<ListarCategoriaDto[]> {
    const params: any = {};
    if (ativo !== undefined) {
      params.ativo = ativo;
    }

    const response = await axios.get<ApiResponse<ListarCategoriaDto[]>>(API_URL, { params });
    
    if (response.data.error) {
      throw new Error(response.data.error.message || "Erro ao listar categorias.");
    }

    return response.data.data;
  }

  async obterCategoriaPorId(id: number): Promise<ListarCategoriaDto> {
    const response = await axios.get<ApiResponse<ListarCategoriaDto>>(`${API_URL}/${id}`);
    
    if (response.data.error) {
      throw new Error(response.data.error.message || "Erro ao obter categoria.");
    }

    return response.data.data;
  }
}

export default new CategoryService(); 