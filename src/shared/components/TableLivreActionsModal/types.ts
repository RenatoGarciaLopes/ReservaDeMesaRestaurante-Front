export type SectionType = 'occupyTable' | 'reserveTable' | 'registerClient' | 'tableSettings';

export interface ModalState {
    loading: boolean;
    successMessage: string | null;
    errorMessage: string | null;
}

export interface ClientFormData {
    nome: string;
    cpf: string;
    email: string;
    telefone: string;
    observacoes: string;
}

export interface ReservationFormData {
    clienteId: number;
    mesaId: number;
    funcionarioId: number;
    dataReserva: string;
    horaReserva: string;
    quantidadePessoas: number;
} 