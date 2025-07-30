# EmployeeManagement - Componentes

Esta pasta contém todos os componentes relacionados ao gerenciamento de funcionários, organizados de forma modular e reutilizável.

## Estrutura

```
EmployeeManagement/
├── index.ts                    # Exportações principais
├── types.ts                    # Tipos TypeScript
├── EmployeeFilters.tsx         # Componente de filtros
├── EmployeeTable.tsx           # Tabela principal
├── EmployeeTableHeader.tsx     # Cabeçalho da tabela
├── EmployeeTableRow.tsx        # Linha da tabela
├── EmployeeActionsMenu.tsx     # Menu de ações
├── EmployeeSnackbar.tsx        # Notificações
├── AddEmployeeModal/           # Modal multistep
│   ├── index.tsx              # Modal principal
│   ├── PersonalStep.tsx       # Step dados pessoais
│   ├── ContactStep.tsx        # Step contato
│   ├── SecurityStep.tsx       # Step segurança
│   └── ReviewStep.tsx         # Step revisão
└── README.md                  # Esta documentação
```

## Hooks Relacionados

Os seguintes hooks foram criados para suportar estes componentes:

- `useEmployees` - Gerencia estado e operações dos funcionários
- `useEmployeeForm` - Gerencia formulário multistep
- `useEmployeeActions` - Gerencia ações (ativar/desativar, excluir)
- `useEmployeeModal` - Gerencia estado do modal
- `useSnackbar` - Gerencia notificações

## Utilitários

- `employeeUtils.ts` - Funções de formatação e manipulação de dados

## Como Usar

```tsx
import {
  EmployeeTable,
  EmployeeFilters,
  AddEmployeeModal,
  EmployeeActionsMenu,
  EmployeeSnackbar,
} from '../shared/components/EmployeeManagement';

// Use os hooks para gerenciar estado
const { employees, loading, error, ... } = useEmployees();
const { snackbar, showSuccess, showError } = useSnackbar();

// Renderize os componentes
<EmployeeFilters
  filter={filter}
  onFilterChange={handleFilterChange}
  onAddEmployee={handleAddEmployee}
/>

<EmployeeTable
  employees={employees}
  selectedEmployees={selectedEmployees}
  onSelectEmployee={handleSelectEmployee}
  // ... outras props
/>
```

## Benefícios da Refatoração

1. **Separação de Responsabilidades**: Cada componente tem uma responsabilidade específica
2. **Reutilização**: Componentes podem ser reutilizados em outras partes da aplicação
3. **Manutenibilidade**: Código mais fácil de manter e testar
4. **Testabilidade**: Componentes menores são mais fáceis de testar
5. **Performance**: Melhor otimização com React.memo e hooks customizados
6. **Legibilidade**: Código mais limpo e organizado 