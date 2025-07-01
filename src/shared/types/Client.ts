export interface CadastrarClienteDto {
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  observacoes?: string; // Opcional, se no backend também for
}

export interface ListarClienteDto {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  observacoes?: string;
  ativo: boolean; 
}