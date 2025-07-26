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
      const response = await axios.get(`${API_BASE_URL}/buscar`, {
        params: { cpf: cleanCpf },
      });
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
};

export default EmployeeService;