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

const EmployeeService = {
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
};

export default EmployeeService;