// src/routes.tsx
import React, { useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { Box } from '@mui/material';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Autoregistro from './pages/AutoRegistro';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ContactPage from './pages/ContactPage';
import ObituariosPage from './pages/ObituariosPage';

import RegistrarCliente from './pages/RegistrarCliente';
import Usuarios from './pages/Usuarios';

// Servicios & Categorías
import CategoriasLanding from './pages/Servicios/CategoriasLanding';
import CatalogoServicios from './pages/Servicios/CatalogoServicios';
import AdminCategorias from './pages/Servicios/AdminCategorias';
import FormCategoria from './pages/Servicios/FormCategoria';
import FormServicio from './pages/Servicios/FormServicio';

// Órdenes
import WizardContratacion from './pages/Ordenes/WizardContratacion';
import SeguimientoOrden from './pages/Ordenes/SeguimientoOrden';

// Importación CSV
import ImportCsv from './pages/Importacion/ImportCsv';

// Checkout (carrito multi-servicio)
import Checkout from './pages/Checkout';

// Nuevas páginas de Admin (from main)
import AdminPanel from './pages/AdminPanel';
import Dashboard from './pages/Dashboard';
import Auditorias from './pages/Auditorias';

function MainRoutes() {
  const location = useLocation();
  const isLogin = ['/login', '/autoregistro'].includes(location.pathname);

  useEffect(() => {
    if (isLogin) document.body.classList.add('login-body');
    else document.body.classList.remove('login-body');
  }, [isLogin]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {!isLogin && <Navbar />}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: !isLogin ? '64px' : 0,
          px: { xs: 2, md: 4 },
        }}
      >
        <Routes>
          {/* — Públicas — */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/autoregistro" element={<Autoregistro />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/contacto" element={<ContactPage />} />
          <Route path="/obituarios" element={<ObituariosPage />} />

          {/* — Wizard de Contratación (CLIENTE/OPERADOR) — */}

          {/* — Catálogo de Categorías & Servicios — */}
          <Route path="/servicios" element={<CategoriasLanding />} />
          <Route path="/servicios/cat/:id" element={<CatalogoServicios />} />

          {/* — ABM Servicios (ADMIN) — */}
          <Route
            path="/servicios/nuevo"
            element={
              <PrivateRoute roles={['ADMIN']}>
                <FormServicio />
              </PrivateRoute>
            }
          />
          <Route
            path="/servicios/editar/:id"
            element={
              <PrivateRoute roles={['ADMIN']}>
                <FormServicio />
              </PrivateRoute>
            }
          />

          {/* — ABM Categorías (ADMIN) — */}
          <Route
            path="/servicios/categorias"
            element={
              <PrivateRoute roles={['ADMIN']}>
                <AdminCategorias />
              </PrivateRoute>
            }
          />
          <Route
            path="/servicios/categorias/nueva"
            element={
              <PrivateRoute roles={['ADMIN']}>
                <FormCategoria />
              </PrivateRoute>
            }
          />
          <Route
            path="/servicios/categorias/editar/:id"
            element={
              <PrivateRoute roles={['ADMIN']}>
                <FormCategoria />
              </PrivateRoute>
            }
          />

          {/* — Órdenes individual (CLIENTE/OPERADOR) — */}
          <Route
            path="/ordenes/seguimiento/:id"
            element={
              <PrivateRoute roles={['CLIENTE', 'OPERADOR']}>
                <SeguimientoOrden />
              </PrivateRoute>
            }
          />

          {/* — Checkout Multicarrito (CLIENTE/OPERADOR) — */}
          <Route
            path="/checkout"
            element={
              <PrivateRoute roles={['CLIENTE', 'OPERADOR']}>
                <Checkout />
              </PrivateRoute>
            }
          />

          {/* — Importación CSV (ADMIN) — */}
          <Route
            path="/importar"
            element={
              <PrivateRoute roles={['ADMIN']}>
                <ImportCsv />
              </PrivateRoute>
            }
          />

          {/* — Gestión de clientes (OPERADOR / ADMIN) — */}
          <Route
            path="/RegistrarCliente"
            element={
              <PrivateRoute roles={['OPERADOR', 'ADMIN']}>
                <RegistrarCliente />
              </PrivateRoute>
            }
          />

          {/* — Gestión de usuarios (ADMIN) — */}
          <Route
            path="/Usuarios"
            element={
              <PrivateRoute roles={['ADMIN']}>
                <Usuarios />
              </PrivateRoute>
            }
          />

          {/* — Panel de administración y dashboards — */}
          <Route
            path="/AdminPanel"
            element={
              <PrivateRoute roles={['ADMIN']}>
                <AdminPanel />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute roles={['ADMIN', 'OPERADOR']}>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/Auditoria"
            element={
              <PrivateRoute roles={['ADMIN']}>
                <Auditorias />
              </PrivateRoute>
            }
          />

          {/* — Catch-all — */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>

      {!isLogin && <Footer />}
    </Box>
  );
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <MainRoutes />
    </BrowserRouter>
  );
}
