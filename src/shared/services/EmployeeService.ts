// src/shared/services/EmployeeService.ts

import axios from 'axios';
import type { ListarFuncionarioDto, Cargo } from '../types/Employee'; // Importe Cargo também

const API_BASE_URL = 'http://localhost:8080/api/funcionarios'; // Verifique se esta é a URL correta do seu backend

// DTO para atualização (o que o frontend envia)
interface AtualizarFuncionarioFrontendDto {
  nome?: string;
  email?: string;
  telefone?: string;
  cargo?: Cargo;
  // Outros campos que podem ser atualizados
}

// DTO para troca de senha
interface TrocarSenhaDto {
  senhaAtual: string;
  novaSenha: string;
  confirmarNovaSenha: string;
}

// DTO para criar funcionário
interface CriarFuncionarioDto {
  nome: string;
  email: string;
  telefone: string;
  cargo: Cargo;
  cpf: string;
  senha: string;
}

// Interface para resposta paginada
interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

const EmployeeService = {
  /**
   * Busca um funcionário pelo ID.
   * @param id O ID do funcionário.
   * @returns O objeto ListarFuncionarioDto do funcionário.
   */
  getEmployeeById: async (id: number): Promise<ListarFuncionarioDto> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${id}`);
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 404) {
          throw new Error("Funcionário não encontrado.");
        }
        throw new Error(error.response.data.message || "Erro ao buscar funcionário por ID.");
      }
      throw new Error("Erro de rede ou ao conectar com o servidor.");
    }
  },

  /**
   * Busca um funcionário pelo CPF.
   * @param cpf O CPF do funcionário.
   * @returns O objeto ListarFuncionarioDto do funcionário.
   */
  getEmployeeByCpf: async (cpf: string): Promise<ListarFuncionarioDto> => {
    try {
      const cleanCpf = cpf.replace(/\D/g, '');
      const response = await axios.get(`${API_BASE_URL}/cpf/${cleanCpf}`);
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 404) {
          throw new Error("Funcionário não encontrado com o CPF informado ou inativo.");
        }
        throw new Error(error.response.data.message || "Erro ao buscar funcionário por CPF.");
      }
      throw new Error("Erro de rede ou ao conectar com o servidor.");
    }
  },

  /**
   * Busca funcionários paginados com filtros.
   * @param pagina Número da página (0-based)
   * @param tamanho Tamanho da página
   * @param ativo Filtro por status ativo/inativo
   * @param cargo Filtro por cargo
   * @returns Lista paginada de funcionários
   */
  getEmployeesPaginated: async (
    pagina: number = 0,
    tamanho: number = 10,
    ativo?: boolean,
    cargo?: Cargo
  ): Promise<PaginatedResponse<ListarFuncionarioDto>> => {
    try {
      const params = new URLSearchParams({
        pagina: pagina.toString(),
        tamanho: tamanho.toString(),
      });

      if (ativo !== undefined) {
        params.append('ativo', ativo.toString());
      }

      if (cargo) {
        params.append('cargo', cargo);
      }

      const url = `${API_BASE_URL}?${params.toString()}`;
      const response = await axios.get(url);
      
      // Verificar se a resposta tem a estrutura esperada
      if (!response.data || typeof response.data !== 'object') {
        throw new Error('Resposta da API inválida');
      }
      
      // Processar a estrutura da resposta
      let result = response.data;
      
      // Se a resposta tem uma propriedade 'data' com 'content' aninhado
      if (response.data.data && response.data.data.content && Array.isArray(response.data.data.content)) {
        result = {
          content: response.data.data.content,
          totalElements: response.data.data.totalElements || 0,
          totalPages: response.data.data.totalPages || 0,
          size: response.data.data.size || 10,
          number: response.data.data.number || 0,
        };
      }
      // Se a resposta tem uma propriedade 'data' que é um array
      else if (response.data.data && Array.isArray(response.data.data)) {
        result = {
          content: response.data.data,
          totalElements: response.data.totalElements || 0,
          totalPages: response.data.totalPages || 0,
          size: response.data.size || 10,
          number: response.data.number || 0,
        };
      }
      // Se a resposta tem uma propriedade 'content' diretamente
      else if (response.data.content && Array.isArray(response.data.content)) {
        result = response.data;
      }
      
      // Garantir que content seja sempre um array
      if (!result.content || !Array.isArray(result.content)) {
        result.content = [];
      }
      
      return result;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || "Erro ao buscar funcionários.");
      }
      throw new Error("Erro de rede ou ao conectar com o servidor.");
    }
  },

  /**
   * Cria um novo funcionário.
   * @param data Dados do funcionário a ser criado
   * @returns O funcionário criado
   */
  createEmployee: async (data: CriarFuncionarioDto): Promise<ListarFuncionarioDto> => {
    try {
      const telefoneLimpo = data.telefone.replace(/[^\d()]/g, '');
      const cpfLimpo = data.cpf.replace(/\D/g, '');

      const response = await axios.post(`${API_BASE_URL}`, {
        ...data,
        telefone: telefoneLimpo,
        cpf: cpfLimpo,
      });
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || "Erro ao criar funcionário.");
      }
      throw new Error("Erro de rede ou ao conectar com o servidor.");
    }
  },

  /**
   * Atualiza os dados de um funcionário.
   * @param id O ID do funcionário a ser atualizado.
   * @param data Os dados a serem atualizados (partial Update).
   * @returns O objeto ListarFuncionarioDto do funcionário atualizado.
   */
  updateEmployee: async (id: number, data: AtualizarFuncionarioFrontendDto): Promise<ListarFuncionarioDto> => {
    try {
      // O endpoint PUT /api/funcionarios/{id} espera o DTO completo, mas você pode enviar apenas os campos que deseja alterar
      // conforme o seu AtualizarFuncionarioDto no backend.
      const response = await axios.put(`${API_BASE_URL}/${id}`, data);
      return response.data.data; // Assumindo ApiResponse wrapper
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || "Erro ao atualizar funcionário.");
      }
      throw new Error("Erro de rede ou ao conectar com o servidor ao atualizar funcionário.");
    }
  },

  /**
   * Troca a senha de um funcionário usando o novo endpoint seguro.
   * @param email O email do funcionário logado.
   * @param data Os dados para troca de senha.
   * @returns Mensagem de sucesso.
   */
  changePassword: async (email: string, data: TrocarSenhaDto): Promise<string> => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/senha?email=${encodeURIComponent(email)}`, data);
      return response.data.message || "Senha alterada com sucesso!";
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage = error.response.data?.error?.message || error.response.data?.message || "Erro ao alterar senha.";
        throw new Error(errorMessage);
      }
      throw new Error("Erro de rede ou ao conectar com o servidor ao alterar senha.");
    }
  },

  /**
   * Ativa ou desativa um funcionário.
   * @param id ID do funcionário
   * @param ativo Status desejado
   * @returns Mensagem de sucesso
   */
  toggleEmployeeStatus: async (id: number, ativo: boolean): Promise<string> => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/${id}`, { ativo });
      return response.data.message || "Status do funcionário atualizado com sucesso!";
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || "Erro ao atualizar status do funcionário.");
      }
      throw new Error("Erro de rede ou ao conectar com o servidor.");
    }
  },

  /**
   * Exclui um funcionário.
   * @param id ID do funcionário a ser excluído
   * @returns Mensagem de sucesso
   */
  deleteEmployee: async (id: number): Promise<string> => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/${id}`);
      return response.data.message || "Funcionário excluído com sucesso!";
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || "Erro ao excluir funcionário.");
      }
      throw new Error("Erro de rede ou ao conectar com o servidor.");
    }
  },
};

export default EmployeeService;