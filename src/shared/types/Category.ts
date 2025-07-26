// src/shared/types/Category.ts

export interface ListarCategoriaDto {
  id: number;
  nome: string;
  ativo: boolean;
}

export interface CadastrarCategoriaDto {
  nome: string;
} 