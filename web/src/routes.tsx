import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import RegistrarCliente from './pages/RegistrarCliente';
import AdminUsuarios from './pages/AdminUsuarios'; // Importa AdminUsuarios
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';

function MainRoutes() {
  const location = useLocation();
  const hideNavbarPaths = ['/login'];
  const showNavbar = !hideNavbarPaths.includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}
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
        <Route
          path="/AdminUsuarios"
          element={
            <PrivateRoute roles={['ADMIN']}>
              <AdminUsuarios />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <MainRoutes />
    </BrowserRouter>
  );
}
