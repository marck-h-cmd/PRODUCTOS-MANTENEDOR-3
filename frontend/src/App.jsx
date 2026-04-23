import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './stores/authStore';

import Catalogo from './pages/Catalogo';

// Páginas (Placeholder por ahora)
const Login = () => <div className="p-8">Login Page</div>;
const Dashboard = () => <div className="p-8">Dashboard Admin</div>;
const Carrito = () => <div className="p-8">Carrito de Compras</div>;

const queryClient = new QueryClient();

function App() {
  const { isAuthenticated, user } = useAuthStore();

  const ProtectedRoute = ({ children, roles }) => {
    if (!isAuthenticated) return <Navigate to="/login" />;
    if (roles && !roles.some(role => user.roles.includes(role))) {
      return <Navigate to="/" />;
    }
    return children;
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-background font-sans antialiased">
          <Routes>
            <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
            
            {/* Rutas Públicas */}
            <Route path="/" element={<Catalogo />} />
            <Route path="/carrito" element={<Carrito />} />

            {/* Rutas Protegidas */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute roles={['Administrador', 'Gerente de Ventas']}>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
        <Toaster position="top-right" />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
