// src/shared/types/Employee.ts

export type Cargo = 'GARCOM' | 'COZINHEIRO' | 'RECEPCIONISTA' | 'GERENTE'; // Adapte conforme seus enums de Cargo

// Renomeado de 'Employee' para 'ListarFuncionarioDto'
export interface ListarFuncionarioDto {
  id: number;
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  cargo: Cargo;
  salario: number;
  dataContratacao: string; // Ou Date, se você for fazer o parse no front
}