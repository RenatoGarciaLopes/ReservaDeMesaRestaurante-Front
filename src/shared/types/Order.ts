export interface ListarPedidoDto {
  id: number;
  reservaId: number;
  funcionarioId: number;
  dataPedido: string;
  status: string;
  itens: PedidoItemDto[];
  valorTotal: number;
}

export interface PedidoItemDto {
  id: number;
  produto: {
    id: number;
    nome: string;
    preco: number;
    categoria: {
      id: number;
      nome: string;
    };
  };
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
}

export interface ItemQuantidadeDto {
  itemId: number;
  quantidade: number;
}

export interface CadastrarPedidoDto {
  reservaId: number;
  funcionarioId: number;
  pedidos: ItemQuantidadeDto[];
}

export interface PedidoItemDetalhadoDto {
  nomeItem: string;
  quantidade: number;
  categoria: string;
  valorUnitario: number;
  subTotal: number;
}

export interface PedidoDetalhadoDto {
  id: number;
  numeroMesa: number;
  dataReserva: string;
  horaReserva: string;
  nomeCliente: string;
  nomeFuncionario: string;
  itens: PedidoItemDetalhadoDto[];
  observacoes: string;
  valorTotal: number;
  status: string;
} 