import { useState, useMemo, useEffect, useCallback } from 'react';
import { Container, Button, Box, CircularProgress, Typography, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import TableHeader from '../shared/components/TableHeader.tsx';
import TableCard from '../shared/components/TableCard.tsx';
import type { Table, TableStatusType, TableFilterStatus, SortOption } from '../shared/types/Table';
import AddIcon from '@mui/icons-material/Add';
import TableService from '../shared/services/TableService';
import SettingsModal from '../shared/components/SettingsModal.tsx';



function TablesPage() {
  const [tables, setTables] = useState<Table[]>([]);
  const [filter, setFilter] = useState<TableFilterStatus>('Todos');
  const [sort, setSort] = useState<SortOption>('number');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openSettingsModal, setOpenSettingsModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);


  const [openAddTableModal, setOpenAddTableModal] = useState(false);
  const [newTableNumber, setNewTableNumber] = useState<number | ''>('');
  const [newTableCapacity, setNewTableCapacity] = useState<number | ''>(4); // Default capacity to 4

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

  // Functions for the new table modal
  const handleOpenAddTableModal = () => {
    setNewTableNumber(''); // Reset number when opening
    setNewTableCapacity(4); // Reset capacity to default
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
      handleCloseAddTableModal(); // Close modal on success
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
      <Container maxWidth={false} disableGutters sx={{ padding: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
        <Typography sx={{ marginLeft: 2 }}>Carregando mesas...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth={false} disableGutters sx={{ padding: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'red' }}>
        <Typography variant="h6">{error}</Typography>
        <Typography variant="body2">Verifique se o backend está rodando e tente recarregar a página.</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth={false} disableGutters sx={{ padding: 0 }}>
      <TableHeader
        currentFilter={filter}
        onFilterChange={handleFilterChange}
        currentSort={sort}
        onSortChange={handleSortChange}
        onSettingsClick={() => setOpenSettingsModal(true)}
      />
      <Box sx={{ padding: 2 }}>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
            justifyContent: 'flex-start',
            paddingLeft: '130px'
          }}
        >
          {filteredAndSortedTables.map((table) => (
            <TableCard key={table.id} table={table} onConfirmArrival={handleConfirmArrival} onTableUpdate={fetchTables} />
          ))}
          <Button
            variant="outlined"
            onClick={handleOpenAddTableModal} // Open modal on click
            sx={{
              width: 295,
              height: 150,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              border: '2px dashed #ccc',
              color: '#888',
              '&:hover': {
                border: '2px dashed #999',
                color: '#555',
                backgroundColor: 'rgba(0,0,0,0.04)'
              }
            }}
          >
            <AddIcon sx={{ fontSize: 48 }} />
          </Button>
        </Box>
      </Box>


      <Dialog open={openAddTableModal} onClose={handleCloseAddTableModal}>
        <DialogTitle>Adicionar Nova Mesa</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Número da Mesa"
            type="number"
            fullWidth
            variant="outlined"
            value={newTableNumber}
            onChange={(e) => setNewTableNumber(e.target.value === '' ? '' : Number(e.target.value))}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Capacidade"
            type="number"
            fullWidth
            variant="outlined"
            value={newTableCapacity}
            onChange={(e) => setNewTableCapacity(e.target.value === '' ? '' : Number(e.target.value))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddTableModal} sx={{
            color: 'secondary.contrastText',
            '&:hover': {
              color: 'primary.light',
            },
          }}>
            Cancelar
          </Button>
          <Button onClick={handleCreateNewTable} variant="contained" sx={{
            backgroundColor: 'primary.dark', color: 'primary.contrastText',
            '&:hover': {
              backgroundColor: 'primary.light'
            }
          }}>
            Adicionar
          </Button>
        </DialogActions>
      </Dialog>
      <SettingsModal
        open={openSettingsModal}
        onClose={() => setOpenSettingsModal(false)}
      />
    </Container>
  );
}

export default TablesPage;