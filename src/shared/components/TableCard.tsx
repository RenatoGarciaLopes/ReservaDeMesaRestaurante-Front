import React, { useState } from 'react'; // Adicione useState
import { Card, CardContent, Typography, Button, Box } from '@mui/material';
import { styled } from '@mui/system'; // Mantenha se estiver usando styled components
import type { Table, TableStatusType } from '../types/Table';
import TableLivreActionsModal from './TableLivreActionsModal'; // Adicione esta importação

interface TableCardProps {
  table: Table;
  onConfirmArrival?: (tableId: number) => void;
  onTableUpdate: () => void; // NOVO: Prop para atualizar a lista de mesas na TablesPage
}

// Seu estilo StyledCard existente
const StyledCard = styled(Card)<{ status: TableStatusType }>(({ theme, status }) => ({
  width: 295,
  height: 150, // Altura fixa para o card
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  flexShrink: 0,
  position: 'relative',
  cursor: 'pointer', // Adicione cursor de ponteiro para indicar que é clicável
  backgroundColor:
    status === 'Livre'
      ? '#3FC879' // Verde
      : status === 'Ocupada'
      ? '#F34D51' // Vermelho
      : '#F7CF42', // Amarelo
  // Se você tiver um tema MUI configurado, use theme.palette.success.main, etc.
  // color: theme.palette.common.white, // Se o currentTextColor for universal
  '&:hover': {
    boxShadow: '0 6px 12px rgba(0,0,0,0.2)', // Efeito de hover
  },
}));

const TableCard: React.FC<TableCardProps> = ({ table, onConfirmArrival, onTableUpdate }) => {
  // NOVO ESTADO: para controlar a abertura do modal de ações da mesa
  const [openTableLivreActionsModal, setOpenTableLivreActionsModal] = useState(false);

  const handleOpenTableLivreActionsModal = () => {
    setOpenTableLivreActionsModal(true);
  };

  const handleCloseTableLivreActionsModal = () => {
    setOpenTableLivreActionsModal(false);
    onTableUpdate(); // Chama a atualização das mesas ao fechar o modal
  };

  const cardColor = { // Seus estilos de cor originais
    Livre: '#3FC879',
    Ocupada: '#F34D51',
    Reservada: '#F7CF42',
  };

  const currentTextColor = '#ffff'; // Seus estilos de cor originais

  return (
    <> {/* Fragmento para incluir o modal ao lado do card */}
      <Card
        sx={{
          backgroundColor: cardColor[table.status],
          color: currentTextColor,
          width: 295,
          height: 150, // Altura fixa para o card
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          flexShrink: 0,
          position: 'relative',
          cursor: 'pointer', // Adicionado para indicar clicável
        }}
        onClick={handleOpenTableLivreActionsModal} // NOVO: O clique no card abre o modal
      >
        <CardContent sx={{ padding: '16px', paddingBottom: '0px' }}>
          <Typography variant="body2" sx={{ fontSize: 14, color: currentTextColor, marginBottom: '2px', fontWeight: 'bold' }}>
            {table.status}
          </Typography>

          <Typography variant="h6" component="div" sx={{ color: currentTextColor, marginBottom: '2px', fontWeight: 'bold', lineHeight: 1 }}>
            Mesa:
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <Typography variant="h5" sx={{ color: currentTextColor, fontWeight: 'normal', lineHeight: 1 }}>
              nº: {table.number}
            </Typography>
            <Typography variant="h6" sx={{ color: currentTextColor, fontWeight: 'normal', lineHeight: 1 }}>
              {table.capacity} Lugares
            </Typography>
          </Box>
        </CardContent>

        <Box
          sx={{
            position: 'absolute',
            bottom: '56px',
            left: '16px',
            right: '16px',
            borderBottom: `3px solid ${currentTextColor}`,
            width: 'auto',
          }}
        />

        <Box
          sx={{
            position: 'absolute',
            bottom: '0',
            left: '0',
            right: '0',
            padding: '0 16px 16px 16px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
            {table.status === 'Ocupada' && table.totalOrder !== undefined && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}> {/* Adicionei width: '100%' aqui para o total pedido alinhar */}
            <Typography variant="body2" sx={{ color: currentTextColor, fontWeight: 'bold' }}>
              Total pedido:
            </Typography>
            <Typography variant="body2" sx={{ color: currentTextColor, fontWeight: 'bold' }}>
              R$ {table.totalOrder.toFixed(2).replace('.', ',')}
            </Typography>
          </Box>
        )}

          {table.status === 'Reservada' && onConfirmArrival && (
            <Button
              variant="contained"
              onClick={(e) => {
                e.stopPropagation(); // IMPORTANTE: Impede o clique no botão de abrir o modal da mesa
                onConfirmArrival(table.id);
              }}
              sx={{
                backgroundColor: '#fff',
                color: '#333',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                fontSize: '0.8rem',
                padding: '6px 12px',
                borderRadius: '10px',
                maxWidth: '213px',
                maxHeight: '27px',
                '&:hover': {
                  backgroundColor: '#eee',
                },
                width: '100%'
              }}
            >
              Confirmar chegada
            </Button>
          )}
        </Box>
      </Card>

      {/* NOVO: Renderiza o TableLivreActionsModal */}
      <TableLivreActionsModal
        open={openTableLivreActionsModal}
        onClose={handleCloseTableLivreActionsModal}
        table={table} // Passa o objeto da mesa para o modal
        onTableUpdate={onTableUpdate} // Passa a função de atualização para o modal
      />
    </>
  );
};

export default TableCard;