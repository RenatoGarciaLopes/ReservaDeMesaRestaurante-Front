// src/types/Table.ts
export type TableStatusType = 'Livre' | 'Ocupada' | 'Reservada'; // NOVO: Tipo para o status real da mesa

export interface Table {
  id: number;
  number: number;
  capacity: number;
  status: TableStatusType; // A mesa só pode ter um status real
  totalOrder?: number;
  active: boolean;
}

export type TableFilterStatus = 'Todos' | TableStatusType; // NOVO: Tipo para as opções do filtro de status

export type SortOption = 'number' | 'status';