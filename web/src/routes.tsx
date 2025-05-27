import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Login from './pages/Login';
import Autoregistro from './pages/AutoRegistro';
import RegistrarCliente from './pages/RegistrarCliente';
import Usuarios from './pages/Usuarios';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import PrivateRoute from './components/PrivateRoute';
import AdminPanel from './pages/AdminPanel';
import Dashboard from './pages/Dashboard';
import Auditorias from './pages/Auditorias';

function MainRoutes() {
  const location = useLocation();
  const isLogin = location.pathname === '/login' || location.pathname === '/autoregistro';

  // Centrar sólo los formularios de login / autoregistro
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
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/autoregistro" element={<Autoregistro />} />

          <Route
            path="/RegistrarCliente"
            element={
              <PrivateRoute roles={['OPERADOR', 'ADMIN']}>
                <RegistrarCliente />
              </PrivateRoute>
            }
          />
          <Route
            path="/Usuarios"
            element={
              <PrivateRoute roles={['ADMIN']}>
                <Usuarios />
              </PrivateRoute>
            }
          />
          <Route
            path="/AdminPanel"
            element={
              <PrivateRoute roles={['ADMIN']}>
                <AdminPanel />
              </PrivateRoute>
            }
          />
          <Route
      path="/Auditorias"
      element={
        <PrivateRoute roles={['ADMIN']}>
          <Auditorias />
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