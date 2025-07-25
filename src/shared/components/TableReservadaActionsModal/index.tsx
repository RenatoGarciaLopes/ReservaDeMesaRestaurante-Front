import React from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, Tabs, Tab, Box, Typography, Divider, Button, TextField, MenuItem } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface TableReservadaActionsModalProps {
  open: boolean;
  onClose: () => void;
  tableNumber: number;
  seats: number;
}

const TableReservadaActionsModal: React.FC<TableReservadaActionsModalProps> = ({ open, onClose, tableNumber, seats }) => {
  const [tab, setTab] = React.useState(0);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <Box display="flex" minHeight={500}>
        {/* Sidebar */}
        <Box width={200} bgcolor="#f5f5f5" p={2} display="flex" flexDirection="column" alignItems="flex-start">
          <Tabs
            orientation="vertical"
            value={tab}
            onChange={(_, v) => setTab(v)}
            sx={{ borderRight: 1, borderColor: 'divider', width: '100%' }}
          >
            <Tab label="Alterar Reserva" />
            <Tab label="Configurações da mesa" />
          </Tabs>
        </Box>
        <Divider orientation="vertical" flexItem />
        {/* Main Content */}
        <Box flex={1} p={4} position="relative">
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{ position: 'absolute', right: 16, top: 16 }}
          >
            <CloseIcon />
          </IconButton>
          {tab === 0 && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>Alterar Reserva:</Typography>
              <Typography variant="h6" gutterBottom>
                nº: {tableNumber} | {seats} Lugares
              </Typography>
              <TextField
                label="Digite o CPF do cliente"
                placeholder="123.456.789-12"
                fullWidth
                margin="normal"
                size="small"
              />
              <Box textAlign="center" my={2}>
                <Typography variant="body2">Ou</Typography>
                <Button variant="contained" sx={{ mt: 1, mb: 2 }}>Cadastre um novo cliente</Button>
              </Box>
              <Box display="flex" gap={2} mb={2}>
                <TextField
                  label="Data"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  size="small"
                  fullWidth
                />
                <TextField
                  label="Hora"
                  type="time"
                  InputLabelProps={{ shrink: true }}
                  size="small"
                  fullWidth
                />
              </Box>
              <TextField
                label="Coloque a quantidade de pessoas"
                select
                fullWidth
                size="small"
                margin="normal"
                defaultValue=""
              >
                <MenuItem value="">Qtd. pessoas</MenuItem>
                {[...Array(seats)].map((_, i) => (
                  <MenuItem key={i + 1} value={i + 1}>{i + 1}</MenuItem>
                ))}
              </TextField>
              <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                Alterar reserva mesa
              </Button>
              <Button variant="outlined" color="error" fullWidth sx={{ mt: 2 }}>
                Cancelar reserva
              </Button>
              <Typography variant="caption" display="block" align="center" sx={{ mt: 2 }}>
                *Preencha somente os campos que irá alterar a reserva
              </Typography>
            </Box>
          )}
          {tab === 1 && (
            <Box>
              <Typography variant="subtitle2">Configurações da mesa</Typography>
              {/* Conteúdo de configurações da mesa aqui */}
            </Box>
          )}
        </Box>
      </Box>
    </Dialog>
  );
};

export default TableReservadaActionsModal; 