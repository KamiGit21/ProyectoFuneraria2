import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Login from './pages/Login';
import RegistrarCliente from './pages/RegistrarCliente';
import Usuarios from './pages/Usuarios';
import PrivateRoute from './components/PrivateRoute';
import AutoRegistro from './pages/AutoRegistro';

function MainRoutes() {
  const location = useLocation();
  const isLogin = location.pathname === '/login';

  // 👉 Aplica clase CSS especial para centrar el login
  useEffect(() => {
    if (isLogin) {
      document.body.classList.add('login-body');
    } else {
      document.body.classList.remove('login-body');
    }
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
          <Route path="/registro" element={<AutoRegistro />} />
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
