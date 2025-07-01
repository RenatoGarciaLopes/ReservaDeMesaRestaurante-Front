
import { BrowserRouter as Router } from 'react-router-dom'; // Importe o Router aqui
import { AuthProvider } from '../src/shared/context/AuthContext';
import AppRoutes from '../src/routes/AppRoutes';

function App() {
  return (
    <Router> {/* O Router agora envolve tudo */}
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;