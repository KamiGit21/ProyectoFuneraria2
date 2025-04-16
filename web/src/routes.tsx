import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import RegistrarCliente from './pages/RegistrarCliente';
import Usuarios from './pages/Usuarios';  // <-- Nuevo componente
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function MainRoutes() {
  const location = useLocation();

  // Se ocultan navbar y footer en ciertos paths
  const hideOnPaths = ['/login'];
  const showNavbar = !hideOnPaths.includes(location.pathname);
  const showFooter = !hideOnPaths.includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col">
      {showNavbar && <Navbar />}

      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/RegistrarCliente"
            element={
              <PrivateRoute roles={['OPERADOR', 'ADMIN']}>
                <RegistrarCliente />
              </PrivateRoute>
            }
          />
          
          {/* Nueva ruta para Administrar Usuarios */}
          <Route
            path="/Usuarios"
            element={
              <PrivateRoute roles={['ADMIN']}>
                <Usuarios />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {showFooter && <Footer />}
    </div>
  );
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <MainRoutes />
    </BrowserRouter>
  );
}
