// src/components/Navbar.tsx
import React, { useContext, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  useMediaQuery,
  Theme,
  Menu,
  MenuItem,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { styled } from '@mui/system';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import Logo from '../assets/Logo_B.png';

const NAV_BG = '#3A4A58';
const TEXT_COLOR = '#FFFFFF';

const NavLink = styled(Link)({
  color: TEXT_COLOR,
  textDecoration: 'none',
  marginLeft: '1.5rem',
  fontFamily: `'Source Sans Pro', sans-serif`,
  fontWeight: 600,
});

export default function Navbar() {
  const { user, logout } = useContext(AuthContext) ?? {};
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

  // Drawer móvil
  const [open, setOpen] = useState(false);
  const toggleDrawer = () => setOpen(!open);

  // Menú admin (desktop)
  const [adminAnchorEl, setAdminAnchorEl] = useState<null | HTMLElement>(null);
  const handleAdminMenuOpen = (e: React.MouseEvent<HTMLElement>) => setAdminAnchorEl(e.currentTarget);
  const handleAdminMenuClose = () => setAdminAnchorEl(null);

  // Scroll a sección "Quiénes somos"
  const scrollToAbout = () => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document
          .getElementById('quienes-somos')
          ?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document
        .getElementById('quienes-somos')
        ?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Links del navbar
  const links: Array<
    | { label: string; path: string; action?: never }
    | { label: string; action: () => void; path?: never }
  > = [
    { label: 'Servicios', path: '/servicios' },
    { label: 'Obituarios', path: '/obituarios' },
    { label: 'Contacto', path: '/contacto' },
    { label: 'Quiénes somos', action: scrollToAbout },
  ];

  const handleAuth = () => {
    if (user) {
      logout?.();
      navigate('/login');
    } else {
      navigate('/login');
    }
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: NAV_BG }}>
      <Toolbar>
        {/* Logo */}
        <Box component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <Box component="img" src={Logo} alt="LumenGest" sx={{ height: 40, mr: 2 }} />
          <Typography variant="h6" sx={{ color: TEXT_COLOR, fontFamily: `'Playfair Display', serif`, fontWeight: 700 }}>
            LumenGest
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {isMobile ? (
          <>
            <IconButton onClick={toggleDrawer} sx={{ color: TEXT_COLOR }}>
              <MenuIcon />
            </IconButton>
            <Drawer anchor="right" open={open} onClose={toggleDrawer}>
              <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer}>
                <List>
                  {links.map((l) =>
                    'action' in l ? (
                      <ListItemButton key={l.label} onClick={l.action}>
                        <ListItemText primary={l.label} />
                      </ListItemButton>
                    ) : (
                      <ListItemButton component={Link} to={l.path} key={l.label}>
                        <ListItemText primary={l.label} />
                      </ListItemButton>
                    )
                  )}

                  {/* Opciones OPERADOR / ADMIN */}
                  {user && (user.rol === 'OPERADOR' || user.rol === 'ADMIN') && (
                    <>
                      <ListItemButton component={Link} to="/RegistrarCliente">
                        <ListItemText primary="Registrar cliente" />
                      </ListItemButton>
                      {user.rol === 'ADMIN' && (
                        <>
                          <ListItemButton component={Link} to="/Usuarios">
                            <ListItemText primary="Administrar usuarios" />
                          </ListItemButton>
                          <ListItemButton component={Link} to="/Auditoria">
                            <ListItemText primary="Ver auditoría" />
                          </ListItemButton>
                          <ListItemButton component={Link} to="/Dashboard">
                            <ListItemText primary="Dashboard" />
                          </ListItemButton>
                        </>
                      )}
                    </>
                  )}

                  <ListItemButton onClick={handleAuth}>
                    <AccountCircle sx={{ mr: 1 }} />
                    <ListItemText primary={user ? 'Cerrar sesión' : 'Iniciar sesión'} />
                  </ListItemButton>
                </List>
              </Box>
            </Drawer>
          </>
        ) : (
          <>
            {/* Desktop links */}
            {links.map((l) =>
              'action' in l ? (
                <Button key={l.label} onClick={l.action} sx={{ color: TEXT_COLOR, ml: 3 }}>
                  {l.label}
                </Button>
              ) : (
                <NavLink to={l.path} key={l.label}>
                  {l.label}
                </NavLink>
              )
            )}

            {/* Menú Admin desktop */}
            {user && (user.rol === 'OPERADOR' || user.rol === 'ADMIN') && (
              <>
                <Button variant="text" sx={{ color: TEXT_COLOR, ml: 3 }} onClick={handleAdminMenuOpen}>
                  Administración
                </Button>
                <Menu
                  anchorEl={adminAnchorEl}
                  open={Boolean(adminAnchorEl)}
                  onClose={handleAdminMenuClose}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                  <MenuItem component={Link} to="/RegistrarCliente" onClick={handleAdminMenuClose}>
                    Registrar cliente
                  </MenuItem>
                  {user.rol === 'ADMIN' && (
                    <>
                      <MenuItem component={Link} to="/Usuarios" onClick={handleAdminMenuClose}>
                        Administrar usuarios
                      </MenuItem>
                      <MenuItem component={Link} to="/Auditoria" onClick={handleAdminMenuClose}>
                        Ver auditoría
                      </MenuItem>
                      <MenuItem component={Link} to="/Dashboard" onClick={handleAdminMenuClose}>
                        Dashboard
                      </MenuItem>
                    </>
                  )}
                </Menu>
              </>
            )}

            <Button
              variant="text"
              startIcon={<AccountCircle />}
              sx={{ color: TEXT_COLOR, ml: 3 }}
              onClick={handleAuth}
            >
              {user ? 'Cerrar sesión' : 'Iniciar sesión'}
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}
