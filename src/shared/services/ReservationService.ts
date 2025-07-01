// src/shared/services/ReservationService.ts

import axios from 'axios';
import type { CadastrarReservaDto, ListarReservaDto } from '../types/Reservation';

const API_URL = 'http://localhost:8080/api/reservas';

const ReservationService = {
  /**
   * Cria uma nova reserva.
   * @param reservationData Os dados da reserva a serem cadastrados.
   * @returns Uma Promise que resolve com o ListarReservaDto da reserva criada.
   */
  createReservation: async (reservationData: CadastrarReservaDto): Promise<ListarReservaDto> => {
    try {
      const response = await axios.post(API_URL, reservationData);
      return response.data.data; // Assumindo ApiResponse wrapper
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || "Erro ao criar reserva.");
      }
      throw new Error("Erro de rede ou ao conectar com o servidor ao criar reserva.");
    }
  },

  /**
   * Confirma a chegada de uma reserva (muda o status da mesa para OCUPADO).
   * @param reservaId O ID da reserva a ser confirmada.
   * @returns Uma Promise que resolve com o ListarReservaDto atualizado.
   */
  confirmReservationArrival: async (reservaId: number): Promise<ListarReservaDto> => {
    try {
      const response = await axios.patch(`${API_URL}/${reservaId}/confirmar`);
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || "Erro ao confirmar chegada da reserva.");
      }
      throw new Error("Erro de rede ou ao conectar com o servidor ao confirmar chegada.");
    }
  },

  // Você pode adicionar outros métodos de reserva aqui (listar, cancelar, concluir, etc.)
};

export default ReservationService;