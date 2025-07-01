

import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../shared/context/AuthContext';
import TablesPage from '../pages/TablesPage';
import LoginPage from '../pages/LoginPage';
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
      {/* Redireciona a raiz para a página de mesas se autenticado, ou para login */}
      <Route path="/" element={<Navigate to="/tables" replace />} />
      {/* Adicione outras rotas privadas aqui */}
    </Routes>
  );
}

export default AppRoutes;