// src/types/Table.ts
import type { ListarReservaDto } from './Reservation';

export type TableStatusType = 'Livre' | 'Ocupada' | 'Reservada'; // NOVO: Tipo para o status real da mesa

export interface Table {
  id: number;
  number: number;
  capacity: number;
  status: TableStatusType; 
  totalOrder?: number;
  active: boolean;
  reservas?: ListarReservaDto[]; // Lista de reservas associadas à mesa
}

export type TableFilterStatus = 'Todos' | TableStatusType; // NOVO: Tipo para as opções do filtro de status

export type SortOption = 'number' | 'status';