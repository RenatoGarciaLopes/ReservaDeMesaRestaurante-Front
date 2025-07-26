# SettingsModal

Este componente foi refatorado seguindo o mesmo padrão dos modais `TableLivreActionsModal` e `TableOcupadaActionsModal`.

## Estrutura

```
SettingsModal/
├── index.tsx                 # Componente principal
├── types.ts                  # Tipos TypeScript
├── SidebarMenu.tsx           # Menu lateral
├── README.md                 # Esta documentação
└── sections/                 # Seções do modal
    ├── index.ts              # Exportações das seções
    ├── ProfileSection.tsx    # Seção de perfil do usuário
    ├── CategorySection.tsx   # Seção de categorias
    ├── MenuSection.tsx       # Seção de cadastro de itens
    └── ManageMenuSection.tsx # Seção de gerenciamento do cardápio
```

## Seções

### ProfileSection
- Gerenciamento de dados do perfil do funcionário
- Alteração de senha
- Logout

### CategorySection
- Cadastro de novas categorias
- Listagem de categorias existentes

### MenuSection
- Cadastro de novos itens do cardápio
- Upload de imagens
- Seleção de categoria

### ManageMenuSection
- Visualização de todos os itens do cardápio
- Filtros por categoria e status
- Busca por nome
- Edição de itens
- Ativação/desativação de itens

## Tipos

- `SectionType`: Define as seções disponíveis
- `ProfileFormData`: Dados do formulário de perfil
- `PasswordFormData`: Dados do formulário de senha
- `CategoryFormData`: Dados do formulário de categoria
- `MenuItemFormData`: Dados do formulário de item do cardápio
- `EditMenuItemFormData`: Dados para edição de item

## Uso

```tsx
import SettingsModal from './SettingsModal';

<SettingsModal 
    open={open} 
    onClose={handleClose} 
/>
```

## Padrão Seguido

Este modal segue o mesmo padrão dos outros modais do projeto:
- Separação de responsabilidades em seções
- Menu lateral para navegação
- Tipos TypeScript bem definidos
- Componentes reutilizáveis
- Estrutura de pastas organizada 