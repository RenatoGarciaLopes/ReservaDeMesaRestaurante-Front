// src/shared/types/MenuItem.ts

export interface ListarItensDto {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  categoria: string;
  imagemUrl: string;
  ativo: boolean;
}

export interface CadastrarItensDto {
  nome: string;
  descricao?: string;
  preco: number;
  imagemUrl?: string;
  categoriaId: number;
} 