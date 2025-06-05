// src/routes.tsx
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Autoregistro from './pages/AutoRegistro';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import RegistrarCliente from './pages/RegistrarCliente';
import Usuarios from './pages/Usuarios';
import CategoriasLanding from './pages/Servicios/CategoriasLanding';
import CatalogoServicios from './pages/Servicios/CatalogoServicios';
import AdminCategorias from './pages/Servicios/AdminCategorias';
import FormCategoria from './pages/Servicios/FormCategoria';
import FormServicio from './pages/Servicios/FormServicio';
import WizardContratacion from './pages/Ordenes/WizardContratacion';
import SeguimientoOrden from './pages/Ordenes/SeguimientoOrden';
import ImportCsv from './pages/Importacion/ImportCsv';
import Checkout from './pages/Checkout';
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
      <Box component="main" sx={{ flexGrow: 1, pt: !isLogin ? '64px' : 0, px: { xs: 2, md: 4 } }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/autoregistro" element={<Autoregistro />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Services & Categories */}
          <Route path="/servicios" element={<CategoriasLanding />} />
          <Route path="/servicios/cat/:id" element={<CatalogoServicios />} />

          {/* Admin Services */}
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

          {/* Admin Categories */}
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

          {/* Orders */}
          <Route
            path="/ordenes/seguimiento/:id"
            element={
              <PrivateRoute roles={['CLIENTE', 'OPERADOR']}>
                <SeguimientoOrden />
              </PrivateRoute>
            }
          />

          {/* Checkout */}
          <Route
            path="/checkout"
            element={
              <PrivateRoute roles={['CLIENTE', 'OPERADOR']}>
                <Checkout />
              </PrivateRoute>
            }
          />

          {/* CSV Import */}
          <Route
            path="/importar"
            element={
              <PrivateRoute roles={['ADMIN']}>
                <ImportCsv />
              </PrivateRoute>
            }
          />

          {/* Client Management */}
          <Route
            path="/RegistrarCliente"
            element={
              <PrivateRoute roles={['OPERADOR', 'ADMIN']}>
                <RegistrarCliente />
              </PrivateRoute>
            }
          />

          {/* User Management */}
          <Route
            path="/Usuarios"
            element={
              <PrivateRoute roles={['ADMIN']}>
                <Usuarios />
              </PrivateRoute>
            }
          />

          {/* Admin Panel & Dashboards */}
          <Route
            path="/AdminPanel"
            element={
              <PrivateRoute roles={['ADMIN']}>
                <AdminPanel />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/*"
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

          {/* Catch-all */}
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