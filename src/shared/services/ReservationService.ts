// src/shared/services/ReservationService.ts

import axios from 'axios';
import type { CadastrarReservaDto, ListarReservaDto } from '../types/Reservation';

interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: {
    message: string;
    details: string;
  };
}

const API_URL = 'http://localhost:8080/api/reservas';

class ReservationService {
  /**
   * Busca a reserva ativa (status ATIVA) para uma mesa específica.
   * Retorna a primeira reserva encontrada ou null se não houver.
   * @param mesaId ID da mesa
   * @returns ListarReservaDto | null
   */
  public getReservaAtivaPorMesa = async (mesaId: number): Promise<ListarReservaDto | null> => {
    const params = { mesaId, status: 'ATIVA', pagina: 0, tamanho: 1 };
    const response = await axios.get<ApiResponse<Page<ListarReservaDto>>>(API_URL, { params });
    if (response.data.error) throw new Error(response.data.error.message);
    const page = response.data.data;
    return page.content.length > 0 ? page.content[0] : null;
  };

  /**
   * Cria uma nova reserva.
   * @param reservationData Os dados da reserva a serem cadastrados.
   * @returns Uma Promise que resolve com o ListarReservaDto da reserva criada.
   */
  public createReservation = async (reservationData: CadastrarReservaDto): Promise<ListarReservaDto> => {
    const response = await axios.post(API_URL, reservationData);
    return response.data.data;
  };

  /**
   * Confirma a chegada de uma reserva (muda o status da mesa para OCUPADO).
   * @param reservaId O ID da reserva a ser confirmada.
   * @returns Uma Promise que resolve com o ListarReservaDto atualizado.
   */
  public confirmReservationArrival = async (reservaId: number): Promise<ListarReservaDto> => {
    const response = await axios.patch(`${API_URL}/${reservaId}/confirmar`);
    return response.data.data;
  };

  /**
   * Lista os horários disponíveis para uma mesa em uma data específica.
   * @param mesaId O ID da mesa para consultar a disponibilidade.
   * @param dataConsulta A data da consulta no formato YYYY-MM-DD.
   * @returns Uma Promise que resolve com um array de horários disponíveis (strings no formato HH:mm).
   */
  public getAvailableTimes = async (mesaId: number, dataConsulta: string): Promise<string[]> => {
    const response = await axios.get(`${API_URL}/disponibilidade`, {
      params: { mesaId, dataConsulta }
    });
    return response.data.data as string[];
  };

  /**
   * Conclui uma reserva (muda o status para CONCLUÍDA e libera a mesa).
   * @param reservaId O ID da reserva a ser concluída.
   * @returns Uma Promise que resolve com o ListarReservaDto atualizado.
   */
  public concluirReserva = async (reservaId: number): Promise<ListarReservaDto> => {
    const response = await axios.patch(`${API_URL}/${reservaId}/concluir`);
    if (response.data.error) throw new Error(response.data.error.message);
    return response.data.data;
  };
}

export default new ReservationService();