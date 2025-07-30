import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Box, 
  Chip,
  Divider
} from '@mui/material';
import { styled } from '@mui/system';
import type { Table, TableStatusType } from '../types/Table';
import TableLivreActionsModal from './TableLivreActionsModal';
import TableOcupadaActionsModal from './TableOcupadaActionsModal';
import PeopleIcon from '@mui/icons-material/People';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

interface TableCardProps {
  table: Table;
  onConfirmArrival?: (tableId: number) => void;
  onTableUpdate: () => void;
}

const StyledCard = styled(Card)<{ $isReserved?: boolean }>(({ theme, $isReserved }) => ({
  width: '100%',
  minHeight: 200,
  borderRadius: 12,
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  position: 'relative',
  cursor: $isReserved ? 'default' : 'pointer',
  transition: 'all 0.3s ease-in-out',
  backgroundColor: '#fff',
  border: '1px solid #f0f0f0',
  '&:hover': {
    transform: $isReserved ? 'none' : 'translateY(-2px)',
    boxShadow: $isReserved ? '0 2px 8px rgba(0,0,0,0.08)' : '0 8px 25px rgba(0,0,0,0.12)',
    borderColor: $isReserved ? '#f0f0f0' : '#e0e0e0',
  },
}));

const getStatusIcon = (status: TableStatusType) => {
  switch (status) {
    case 'Livre':
      return <RestaurantIcon sx={{ fontSize: 20, color: '#4caf50' }} />;
    case 'Ocupada':
      return <PeopleIcon sx={{ fontSize: 20, color: '#f44336' }} />;
    case 'Reservada':
      return <EventAvailableIcon sx={{ fontSize: 20, color: '#ff9800' }} />;
    default:
      return <RestaurantIcon sx={{ fontSize: 20, color: '#757575' }} />;
  }
};

const getStatusColor = (status: TableStatusType) => {
  switch (status) {
    case 'Livre':
      return '#4caf50';
    case 'Ocupada':
      return '#f44336';
    case 'Reservada':
      return '#ff9800';
    default:
      return '#757575';
  }
};

const getStatusBackground = (status: TableStatusType) => {
  switch (status) {
    case 'Livre':
      return '#f1f8e9';
    case 'Ocupada':
      return '#ffebee';
    case 'Reservada':
      return '#fff3e0';
    default:
      return '#f5f5f5';
  }
};

const TableCard: React.FC<TableCardProps> = ({ table, onConfirmArrival, onTableUpdate }) => {
  const [openTableLivreActionsModal, setOpenTableLivreActionsModal] = useState(false);
  const [openTableOcupadaActionsModal, setOpenTableOcupadaActionsModal] = useState(false);

  const handleOpenModal = () => {
    if (table.status === 'Livre') {
      setOpenTableLivreActionsModal(true);
    } else if (table.status === 'Ocupada') {
      setOpenTableOcupadaActionsModal(true);
    }
  };

  const handleCloseTableLivreActionsModal = () => {
    setOpenTableLivreActionsModal(false);
    onTableUpdate();
  };

  const handleCloseTableOcupadaActionsModal = () => {
    setOpenTableOcupadaActionsModal(false);
    onTableUpdate();
  };

  const handleConfirmArrivalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onConfirmArrival?.(table.id);
  };

  return (
    <>
      <StyledCard 
        $isReserved={table.status === 'Reservada'}
        onClick={table.status === 'Reservada' ? undefined : handleOpenModal}
        sx={{ 
          height: 200
        }}
      >
        {/* Header do Card */}
        <Box sx={{ 
          p: 2, 
          pb: 1,
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {getStatusIcon(table.status)}
            <Typography 
              variant="body2" 
              sx={{ 
                color: getStatusColor(table.status),
                fontWeight: 600,
                fontSize: '0.875rem'
              }}
            >
              {table.status}
            </Typography>
          </Box>
          
          <Chip
            label={`Mesa ${table.number}`}
            size="small"
            sx={{
              backgroundColor: '#f5f5f5',
              color: '#333',
              fontWeight: 600,
              fontSize: '0.75rem',
              border: '1px solid #e0e0e0'
            }}
          />
        </Box>

        <Divider sx={{ mx: 2, mb: 1 }} />

        {/* Conteúdo Principal */}
        <CardContent sx={{ p: 2, pt: 0, flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          {/* Capacidade */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1, 
            mb: 1,
            p: 1,
            backgroundColor: '#f8f9fa',
            borderRadius: 1,
            border: '1px solid #e9ecef'
          }}>
            <PeopleIcon sx={{ fontSize: 18, color: '#6c757d' }} />
            <Typography variant="body2" sx={{ color: '#495057', fontWeight: 500 }}>
              {table.capacity} lugares
            </Typography>
          </Box>

          {/* Informações Adicionais */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, minHeight: 0 }}>
            {table.status === 'Ocupada' && table.totalOrder !== undefined && (
              <Box sx={{ 
                backgroundColor: '#fff3cd',
                borderRadius: 1,
                p: 1,
                border: '1px solid #ffeaa7'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <AttachMoneyIcon sx={{ fontSize: 16, color: '#856404' }} />
                  <Typography variant="body2" sx={{ color: '#856404', fontWeight: 600, fontSize: '0.8rem' }}>
                    Total do Pedido
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ color: '#856404', fontWeight: 700, fontSize: '1.1rem' }}>
                  R$ {table.totalOrder.toFixed(2).replace('.', ',')}
                </Typography>
              </Box>
            )}

            {table.status === 'Reservada' && (
              <>
                <Box sx={{ 
                  backgroundColor: '#fff3e0',
                  borderRadius: 1,
                  p: 1,
                  border: '1px solid #ffcc80',
                  mb: -1
                }}>
                  <Typography variant="body2" sx={{ color: '#e65100', fontWeight: 500, fontSize: '0.8rem' }}>
                    Aguardando chegada
                  </Typography>
                </Box>
                
                <Box sx={{ 
                  mt: 'auto',
                  pt: 0
                }}>
                  <Button
                    variant="contained"
                    onClick={handleConfirmArrivalClick}
                    startIcon={<CheckCircleIcon />}
                    fullWidth
                    sx={{
                      backgroundColor: '#ff9800',
                      color: 'white',
                      fontWeight: 600,
                      textTransform: 'none',
                      borderRadius: 2,
                      py: 1,
                      fontSize: '0.8rem',
                      boxShadow: '0 2px 8px rgba(255, 152, 0, 0.3)',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        backgroundColor: '#f57c00',
                        boxShadow: '0 4px 12px rgba(255, 152, 0, 0.4)',
                        transform: 'translateY(-1px)',
                      },
                      '&:active': {
                        transform: 'translateY(0)',
                      },
                    }}
                  >
                    Confirmar Chegada
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </CardContent>

        {/* Borda de Status Sutil */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          backgroundColor: getStatusColor(table.status),
          opacity: 0.8
        }} />
      </StyledCard>

      {/* Modais */}
      <TableLivreActionsModal
        open={openTableLivreActionsModal}
        onClose={handleCloseTableLivreActionsModal}
        table={table}
        onTableUpdate={onTableUpdate}
      />

      <TableOcupadaActionsModal
        open={openTableOcupadaActionsModal}
        onClose={handleCloseTableOcupadaActionsModal}
        table={table}
        onTableUpdate={onTableUpdate}
      />
    </>
  );
};

export default TableCard;