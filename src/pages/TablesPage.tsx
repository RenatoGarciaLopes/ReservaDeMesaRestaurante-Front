import { useState, useMemo, useEffect, useCallback } from 'react';
import { 
  Container, 
  Button, 
  Box, 
  CircularProgress, 
  Typography, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField,
  Chip,
  AppBar,
  Toolbar,
  Paper,
} from '@mui/material';
import TableCard from '../shared/components/TableCard.tsx';
import type { Table, TableStatusType, TableFilterStatus, SortOption } from '../shared/types/Table';
import AddIcon from '@mui/icons-material/Add';
import PeopleIcon from '@mui/icons-material/People';
import TableService from '../shared/services/TableService';
import SettingsModal from '../shared/components/SettingsModal';
import UserAvatar from '../shared/components/UserAvatar';
import { useAuth } from '../shared/context/AuthContext';
import { useNavigate } from 'react-router-dom';

function TablesPage() {
  const { employee } = useAuth();
  const navigate = useNavigate();
  
  const [tables, setTables] = useState<Table[]>([]);
  const [filter, setFilter] = useState<TableFilterStatus>('Todos');
  const [sort, setSort] = useState<SortOption>('number');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openSettingsModal, setOpenSettingsModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(0);

  const [openAddTableModal, setOpenAddTableModal] = useState(false);
  const [newTableNumber, setNewTableNumber] = useState<number | ''>('');
  const [newTableCapacity, setNewTableCapacity] = useState<number | ''>(4);

  const fetchTables = useCallback(async () => {
    try {
      setLoading(true);
      const { content } = await TableService.getMesasPaginated(
        currentPage,
        pageSize,
        filter,
        undefined,
        true
      );
      setTables(content);
      setError(null);
    } catch (err) {
      console.error("Erro ao buscar mesas:", err);
      setError("Não foi possível carregar as mesas. Verifique se o backend está rodando e tente recarregar a página.");
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, filter]);

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  const handleFilterChange = (newFilter: TableFilterStatus) => {
    setFilter(newFilter);
    setCurrentPage(0);
  };

  const handleSortChange = (newSort: SortOption) => {
    setSort(newSort);
  };

  const handleConfirmArrival = async (tableId: number) => {
    try {
      await TableService.updateMesaStatus(tableId, 'Ocupada');
      fetchTables();
      alert("Chegada confirmada com sucesso!");
    } catch (error) {
      console.error("Erro ao confirmar chegada:", error);
      alert("Erro ao confirmar chegada. Por favor, tente novamente.");
    }
  };

  const handleOpenAddTableModal = () => {
    setNewTableNumber('');
    setNewTableCapacity(4);
    setOpenAddTableModal(true);
  };

  const handleCloseAddTableModal = () => {
    setOpenAddTableModal(false);
  };

  const handleCreateNewTable = async () => {
    if (newTableNumber === '' || newTableCapacity === '') {
      alert("Por favor, preencha o número e a capacidade da mesa.");
      return;
    }

    try {
      const createdTable = await TableService.createMesa(Number(newTableNumber), Number(newTableCapacity));
      fetchTables();
      alert(`Mesa ${createdTable.number} adicionada com sucesso!`);
      handleCloseAddTableModal();
    } catch (error) {
      console.error("Erro ao adicionar mesa:", error);
      alert("Erro ao adicionar mesa. Por favor, tente novamente.");
    }
  };

  const filteredAndSortedTables = useMemo(() => {
    const sorted = [...tables].sort((a, b) => {
      if (sort === 'number') {
        return a.number - b.number;
      } else if (sort === 'status') {
        const statusOrder: Record<TableStatusType, number> = { 'Livre': 1, 'Reservada': 2, 'Ocupada': 3 };
        return statusOrder[a.status] - statusOrder[b.status];
      }
      return 0;
    });

    return sorted;
  }, [tables, sort]);



  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        gap: 2
      }}>
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary">
          Carregando mesas...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', 
        gap: 2,
        p: 3
      }}>
        <Typography variant="h5" color="error" gutterBottom>
          Erro ao carregar mesas
        </Typography>
        <Typography variant="body1" color="text.secondary" textAlign="center">
          {error}
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => window.location.reload()}
          sx={{ mt: 2 }}
        >
          Tentar novamente
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Header Principal */}
      <AppBar position="static" elevation={0} sx={{ backgroundColor: 'white', borderBottom: '1px solid #e0e0e0' }}>
        <Toolbar>
          <Typography variant="h4" component="h1" sx={{ 
            flexGrow: 1, 
            color: '#1a1a1a',
            fontWeight: 600,
            fontSize: { xs: '1.5rem', sm: '2rem' }
          }}>
            Gerenciamento de Mesas
          </Typography>
          <UserAvatar onOpenSettings={() => setOpenSettingsModal(true)} />
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Barra de Ferramentas */}
        <Paper elevation={0} sx={{ p: 2, mb: 3, backgroundColor: 'white', borderRadius: 2 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', justifyContent: 'space-between' }}>
            {/* Filtros */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                Filtros:
              </Typography>
              <Chip
                label="Todos"
                onClick={() => handleFilterChange('Todos')}
                color={filter === 'Todos' ? 'primary' : 'default'}
                variant={filter === 'Todos' ? 'filled' : 'outlined'}
                size="small"
              />
              <Chip
                label="Livre"
                onClick={() => handleFilterChange('Livre')}
                color={filter === 'Livre' ? 'success' : 'default'}
                variant={filter === 'Livre' ? 'filled' : 'outlined'}
                size="small"
              />
              <Chip
                label="Ocupada"
                onClick={() => handleFilterChange('Ocupada')}
                color={filter === 'Ocupada' ? 'error' : 'default'}
                variant={filter === 'Ocupada' ? 'filled' : 'outlined'}
                size="small"
              />
              <Chip
                label="Reservada"
                onClick={() => handleFilterChange('Reservada')}
                color={filter === 'Reservada' ? 'warning' : 'default'}
                variant={filter === 'Reservada' ? 'filled' : 'outlined'}
                size="small"
              />
            </Box>
            
            {/* Ordenação */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                Ordenar:
              </Typography>
              <Chip
                label="Número"
                onClick={() => handleSortChange('number')}
                color={sort === 'number' ? 'primary' : 'default'}
                variant={sort === 'number' ? 'filled' : 'outlined'}
                size="small"
              />
              <Chip
                label="Status"
                onClick={() => handleSortChange('status')}
                color={sort === 'status' ? 'primary' : 'default'}
                variant={sort === 'status' ? 'filled' : 'outlined'}
                size="small"
              />
            </Box>
            
            {/* Botões de Ação */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleOpenAddTableModal}
                sx={{ textTransform: 'none' }}
              >
                Nova Mesa
              </Button>
              {employee?.cargo === 'GERENTE' && (
                <Button
                  variant="contained"
                  startIcon={<PeopleIcon />}
                  onClick={() => navigate('/employees')}
                  sx={{ 
                    textTransform: 'none',
                    backgroundColor: '#4caf50',
                    '&:hover': {
                      backgroundColor: '#388e3c',
                    },
                  }}
                >
                  Gerenciar Colaboradores
                </Button>
              )}
            </Box>
          </Box>
        </Paper>

        {/* Grid de Mesas */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { 
            xs: '1fr', 
            sm: 'repeat(2, 1fr)', 
            md: 'repeat(3, 1fr)', 
            lg: 'repeat(4, 1fr)' 
          }, 
          gap: 3 
        }}>
          {filteredAndSortedTables.map((table) => (
            <Box key={table.id}>
              <TableCard 
                table={table} 
                onConfirmArrival={handleConfirmArrival} 
                onTableUpdate={fetchTables} 
              />
            </Box>
          ))}
          
          {/* Card Adicionar Mesa */}
          <Box>
            <Paper
              elevation={0}
              onClick={handleOpenAddTableModal}
              sx={{
                width: '100%',
                height: 200,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                border: '2px dashed #e0e0e0',
                borderRadius: 2,
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                backgroundColor: 'white',
                '&:hover': {
                  border: '2px dashed #999',
                  backgroundColor: '#fafafa',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                }
              }}
            >
              <AddIcon sx={{ fontSize: 40, color: '#999', mb: 1 }} />
              <Typography variant="h6" color="text.secondary" textAlign="center" sx={{ mb: 0.5 }}>
                Adicionar Mesa
              </Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ fontSize: '0.875rem' }}>
                Clique para criar uma nova mesa
              </Typography>
            </Paper>
          </Box>
        </Box>

        {/* Estado vazio */}
        {filteredAndSortedTables.length === 0 && !loading && (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            py: 8,
            textAlign: 'center'
          }}>
            <Typography variant="h5" color="text.secondary" gutterBottom>
              Nenhuma mesa encontrada
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {filter === 'Todos' 
                ? 'Não há mesas cadastradas no sistema.'
                : `Não há mesas com status "${filter}" no momento.`
              }
            </Typography>
            {filter !== 'Todos' && (
              <Button 
                variant="outlined" 
                onClick={() => handleFilterChange('Todos')}
              >
                Ver todas as mesas
              </Button>
            )}
          </Box>
        )}
      </Container>

      {/* Modal Adicionar Mesa */}
      <Dialog 
        open={openAddTableModal} 
        onClose={handleCloseAddTableModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" fontWeight={600}>
            Adicionar Nova Mesa
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Número da Mesa"
            type="number"
            fullWidth
            variant="outlined"
            value={newTableNumber}
            onChange={(e) => setNewTableNumber(e.target.value === '' ? '' : Number(e.target.value))}
            sx={{ mb: 3 }}
          />
          <TextField
            margin="dense"
            label="Capacidade"
            type="number"
            fullWidth
            variant="outlined"
            value={newTableCapacity}
            onChange={(e) => setNewTableCapacity(e.target.value === '' ? '' : Number(e.target.value))}
            helperText="Número de lugares disponíveis na mesa"
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={handleCloseAddTableModal}
            variant="outlined"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleCreateNewTable} 
            variant="contained"
            startIcon={<AddIcon />}
          >
            Adicionar Mesa
          </Button>
        </DialogActions>
      </Dialog>

      <SettingsModal
        open={openSettingsModal}
        onClose={() => setOpenSettingsModal(false)}
      />
    </Box>
  );
}

export default TablesPage;