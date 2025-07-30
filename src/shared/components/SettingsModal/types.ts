export type SectionType = 'profile' | 'category' | 'manageMenu' | 'security';

export interface ModalState {
    loading: boolean;
    successMessage: string | null;
    errorMessage: string | null;
}

export interface ProfileFormData {
    nome: string;
    email: string;
    telefone: string;
    cargo: string;
    cpf: string;
}

export interface PasswordFormData {
    senhaAtual: string;
    novaSenha: string;
    confirmarSenha: string;
}

export interface CategoryFormData {
    nome: string;
}

export interface MenuItemFormData {
    nome: string;
    descricao: string;
    preco: string;
    categoriaId: number | '';
    imagem: File | null;
}

export interface EditMenuItemFormData {
    nome: string;
    descricao: string;
    preco: number;
    categoriaId: number;
    imagemUrl?: string;
    imagem?: File;
} 