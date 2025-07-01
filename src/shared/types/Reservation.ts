export type StatusReserva = 'CONFIRMADA' | 'CANCELADA' | 'CONCLUIDA'; // Adapte conforme seu enum

export interface CadastrarReservaDto {
  clienteId: number;
  mesaId: number;
  funcionarioId?: number; // Opcional, pois no backend é nullable
  dataReserva: string; // Formato 'YYYY-MM-DD'
  horaReserva: string; // Formato 'HH:mm'
  quantidadePessoas: number;
}

export interface ListarReservaDto {
  id: number;
  cliente: { id: number; nome: string; cpf: string; email: string; telefone: string }; // Detalhes básicos do cliente
  mesa: { id: number; numero: number; capacidade: number; status: string }; // Detalhes básicos da mesa
  funcionario?: { id: number; nome: string }; // Detalhes básicos do funcionário
  dataReserva: string; // Formato 'YYYY-MM-DD'
  horaReserva: string; // Formato 'HH:mm'
  quantidadePessoas: number;
  status: StatusReserva;
  // Adicione outros campos que seu ListarReservaDto do backend possa ter
}