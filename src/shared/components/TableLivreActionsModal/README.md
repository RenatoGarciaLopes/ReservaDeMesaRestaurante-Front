# TableLivreActionsModal - Componente Refatorado

Este componente foi refatorado seguindo as melhores práticas de React e TypeScript, dividindo a funcionalidade em componentes menores e mais focados.

## Estrutura de Arquivos

```
TableLivreActionsModal/
├── index.tsx                    # Componente principal
├── SidebarMenu.tsx             # Menu lateral de navegação
├── types.ts                    # Tipos compartilhados
├── README.md                   # Esta documentação
├── hooks/                      # Hooks customizados
│   ├── useClientForm.ts        # Gerenciamento do formulário de cliente
│   ├── useClientSearch.ts      # Busca de clientes por CPF
│   ├── useReservationForm.ts   # Gerenciamento do formulário de reserva
│   └── useModalState.ts        # Estado geral do modal
├── sections/                   # Seções do modal
│   ├── OccupyTableSection.tsx  # Seção para ocupar mesa
│   ├── ReserveTableSection.tsx # Seção para reservar mesa
│   ├── RegisterClientSection.tsx # Seção para cadastrar cliente
│   └── TableSettingsSection.tsx # Seção de configurações
└── components/                 # Componentes utilitários
    ├── MessageDisplay.tsx      # Exibição de mensagens
    └── StyledButton.tsx        # Botões padronizados
```

## Principais Melhorias

### 1. **Separação de Responsabilidades**
- Cada seção tem seu próprio componente
- Hooks customizados para lógica de negócio
- Componentes utilitários reutilizáveis

### 2. **Hooks Customizados**
- `useClientForm`: Gerencia formulário de cadastro de cliente
- `useClientSearch`: Gerencia busca de clientes por CPF
- `useReservationForm`: Gerencia formulário de reserva
- `useModalState`: Gerencia estado geral do modal

### 3. **Componentes Utilitários**
- `MessageDisplay`: Exibe mensagens de sucesso/erro
- `StyledButton`: Botões com estilos padronizados
- `SidebarMenu`: Menu lateral de navegação

### 4. **Tipagem Forte**
- Tipos compartilhados em `types.ts`
- Interfaces bem definidas para props
- TypeScript em todos os componentes

### 5. **Reutilização**
- Componentes podem ser reutilizados em outros contextos
- Hooks podem ser usados independentemente
- Estilos padronizados e consistentes

## Como Usar

```tsx
import TableLivreActionsModal from './TableLivreActionsModal';

function MyComponent() {
    const [open, setOpen] = useState(false);
    const [table, setTable] = useState<Table | null>(null);

    return (
        <TableLivreActionsModal
            open={open}
            onClose={() => setOpen(false)}
            table={table}
            onTableUpdate={() => {
                // Atualizar lista de mesas
            }}
        />
    );
}
```

## Benefícios da Refatoração

1. **Manutenibilidade**: Código mais fácil de manter e modificar
2. **Testabilidade**: Componentes menores são mais fáceis de testar
3. **Reutilização**: Hooks e componentes podem ser reutilizados
4. **Legibilidade**: Código mais limpo e organizado
5. **Performance**: Melhor controle sobre re-renderizações
6. **Escalabilidade**: Fácil adicionar novas funcionalidades 