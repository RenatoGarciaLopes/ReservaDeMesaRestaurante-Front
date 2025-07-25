
import { BrowserRouter as Router } from 'react-router-dom'; // Importe o Router aqui
import { AuthProvider } from '../src/shared/context/AuthContext';
import AppRoutes from '../src/routes/AppRoutes';

// Importe o provider e o adaptador:
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale/pt-BR';

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
      <Router>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </Router>
    </LocalizationProvider>
  );
}

export default App;