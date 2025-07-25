export type SectionType = 'fazerPedido' | 'fecharConta' | 'tableSettings';

export interface ModalState {
    loading: boolean;
    successMessage: string | null;
    errorMessage: string | null;
}

export interface MenuItem {
    id: number;
    nome: string;
    descricao: string;
    preco: number;
    categoria: string;
    imagemUrl: string;
    quantidade?: number;
}

export interface Category {
    id: number;
    nome: string;
    descricao?: string;
    ativo: boolean;
}

export interface OrderItem {
    itemId: number;
    quantidade: number;
    precoUnitario: number;
} 