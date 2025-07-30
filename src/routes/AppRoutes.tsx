

import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../shared/context/AuthContext';
import TablesPage from '../pages/TablesPage';
import LoginPage from '../pages/LoginPage';
import EmployeesPage from '../pages/EmployeesPage';
import CircularProgress from '@mui/material/CircularProgress'; // Importe CircularProgress
import Typography from '@mui/material/Typography'; // Importe Typography
import type { JSX } from '@emotion/react/jsx-runtime';

// Um componente de rota privada
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, loadingAuth } = useAuth();

  if (loadingAuth) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
        <Typography sx={{ marginLeft: 2 }}>Verificando autenticação...</Typography>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Componente de rota para gerentes
const ManagerRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, loadingAuth, employee } = useAuth();

  if (loadingAuth) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
        <Typography sx={{ marginLeft: 2 }}>Verificando autenticação...</Typography>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (employee?.cargo !== 'GERENTE') {
    return <Navigate to="/tables" />;
  }

  return children;
};

function AppRoutes() {
  return (
    // Remova <BrowserRouter as Router> e </BrowserRouter> daqui
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/tables"
        element={
          <PrivateRoute>
            <TablesPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/employees"
        element={
          <ManagerRoute>
            <EmployeesPage />
          </ManagerRoute>
        }
      />
      {/* Redireciona a raiz para a página de mesas se autenticado, ou para login */}
      <Route path="/" element={<Navigate to="/tables" replace />} />
      {/* Adicione outras rotas privadas aqui */}
    </Routes>
  );
}

export default AppRoutes;