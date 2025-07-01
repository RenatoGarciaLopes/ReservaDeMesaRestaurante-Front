// src/shared/services/ClientService.ts

import axios from 'axios';
import type { CadastrarClienteDto, ListarClienteDto } from '../types/Client';

// Certifique-se de que esta URL corresponde ao endpoint do seu backend para clientes
const API_URL = 'http://localhost:8080/api/clientes';

const ClientService = {
    /**
     * Cadastra um novo cliente no backend.
     * @param clientData Os dados do cliente a serem cadastrados.
     * @returns Uma Promise que resolve com o ListarClienteDto do cliente criado.
     */
    createClient: async (clientData: CadastrarClienteDto): Promise<ListarClienteDto> => {
        try {
            // Limpa o CPF e telefone antes de enviar, se o backend espera eles sem formatação
            const dataToSend = {
                ...clientData,
                cpf: clientData.cpf.replace(/\D/g, ''), // Remove não dígitos do CPF
                telefone: clientData.telefone.replace(/\D/g, ''), // Remove não dígitos do Telefone
            };

            const response = await axios.post(API_URL, dataToSend);
            // Assumindo que seu backend retorna um ApiResponse wrapper
            return response.data.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                // Se o backend enviar uma mensagem de erro detalhada, use-a
                throw new Error(error.response.data.message || "Erro ao cadastrar cliente.");
            }
            throw new Error("Erro de rede ou ao conectar com o servidor ao cadastrar cliente.");
        }
    },

    /**
     * Busca um cliente por CPF.
     * @param cpf O CPF do cliente a ser buscado (apenas números).
     * @returns Uma Promise que resolve com o ListarClienteDto do cliente encontrado ou null se não encontrado.
     */
    searchClientByCpf: async (cpf: string): Promise<ListarClienteDto | null> => {
        try {
            const cleanCpf = cpf.replace(/\D/g, ''); // Garante que o CPF esteja limpo
            const response = await axios.get(`${API_URL}/buscar`, {
                params: { cpf: cleanCpf },
            });
            return response.data.data; // Retorna o objeto de cliente
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                if (error.response.status === 404) {
                    return null; // Cliente não encontrado, retorna null
                }
                throw new Error(error.response.data.message || "Erro ao buscar cliente por CPF.");
            }
            throw new Error("Erro de rede ou ao conectar com o servidor ao buscar cliente.");
        }
    },

};

export default ClientService;