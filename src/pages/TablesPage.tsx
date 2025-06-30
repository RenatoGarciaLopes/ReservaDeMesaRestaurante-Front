import { useState, useMemo, useEffect, useCallback } from 'react';
import { Container, Button, Box, CircularProgress, Typography } from '@mui/material';
import TableHeader from '../shared/components/TableHeader.tsx';
import TableCard from '../shared/components/TableCard.tsx';
// NOVO: Importa Table, TableStatusType e TableFilterStatus
import type { Table, TableStatusType, TableFilterStatus, SortOption } from '../shared/types/Table';
import AddIcon from '@mui/icons-material/Add';
import TableService from '../shared/services/TableService';

function TablesPage() {
  const [tables, setTables] = useState<Table[]>([]);
  // NOVO: O filtro agora é do tipo TableFilterStatus
  const [filter, setFilter] = useState<TableFilterStatus>('Todos');
  const [sort, setSort] = useState<SortOption>('number');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const fetchTables = useCallback(async () => {
    try {
      setLoading(true);
      const { content } = await TableService.getMesasPaginated(
        currentPage,
        pageSize,
        filter, // Passa o filtro diretamente (do tipo TableFilterStatus)
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

  const handleFilterChange = (newFilter: TableFilterStatus) => { // Aceita TableFilterStatus
    setFilter(newFilter);
    setCurrentPage(0);
  };

  const handleSortChange = (newSort: SortOption) => {
    setSort(newSort);
  };

  const handleConfirmArrival = async (tableId: number) => {
    try {
      // NOVO: O status que enviamos para o backend é TableStatusType
      await TableService.updateMesaStatus(tableId, 'Ocupada');
      fetchTables();
      alert("Chegada confirmada com sucesso!");
    } catch (error) {
      console.error("Erro ao confirmar chegada:", error);
      alert("Erro ao confirmar chegada. Por favor, tente novamente.");
    }
  };

  const handleAddTable = async () => {
    try {
      const createdTable = await TableService.createMesa(0, 4);
      fetchTables();
      alert(`Mesa ${createdTable.number} adicionada com sucesso!`);
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
        // NOVO: A ordenação usa TableStatusType para comparar
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
      />
      <Box sx={{ padding: 2 }}>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
            justifyContent: 'flex-start',
            paddingLeft:'130px'

          }}
        >
          {filteredAndSortedTables.map((table) => (
            <TableCard key={table.id} table={table} onConfirmArrival={handleConfirmArrival} />
          ))}
          <Button
            variant="outlined"
            onClick={handleAddTable}
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
    </Container>
  );
}

export default TablesPage;