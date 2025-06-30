import React from 'react';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';
import type { Table } from '../types/Table';

interface TableCardProps {
  table: Table;
  onConfirmArrival?: (tableId: number) => void;
}

const TableCard: React.FC<TableCardProps> = ({ table, onConfirmArrival }) => {
  const cardColor = {
    Livre: '#3FC879',
    Ocupada: '#F34D51',
    Reservada: '#F7CF42',
  };

  const currentTextColor =  '#ffff';

  return (
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
      }}
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

      {/* Box que contém o botão (ou Total pedido) - ESTE É O CONTÊINER QUE CENTRALIZA O BOTÃO */}
      <Box
        sx={{
          position: 'absolute',
          bottom: '0',
          left: '0',
          right: '0',
          padding: '0 16px 16px 16px', // Padding consistente
          display: 'flex',          // <-- Torna este Box um contêiner flexível
          justifyContent: 'center', // <-- Centraliza o item filho (o botão ou Total pedido) horizontalmente
          alignItems: 'center',     // <-- Opcional, centraliza verticalmente se houver espaço extra
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
            onClick={() => onConfirmArrival(table.id)}
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
  );
};

export default TableCard;