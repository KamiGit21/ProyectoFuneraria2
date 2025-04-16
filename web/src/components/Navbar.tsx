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
import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import Logo from '../assets/Logo_B.png'; // Ajusta la ruta al logo si cambia

// Colores según la paleta
const NAV_BG = '#3A4A58';
const TEXT_COLOR = '#FFFFFF';

// Estilos para enlaces sin subrayado
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
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

  // Estado para el Drawer (versión móvil)
  const [open, setOpen] = useState(false);
  const toggleDrawer = () => setOpen(!open);

  // Menú de administración (desktop)
  const [adminAnchorEl, setAdminAnchorEl] = useState<null | HTMLElement>(null);
  const handleAdminMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAdminAnchorEl(event.currentTarget);
  };
  const handleAdminMenuClose = () => {
    setAdminAnchorEl(null);
  };

  // Enlaces generales del Navbar
  const links = [
    { label: 'Servicios', path: '/servicios' },
    { label: 'Obituarios', path: '/obituarios' },
    { label: 'Contacto', path: '/contacto' },
    { label: 'Quiénes somos', path: '/' },
  ];

  // Manejo de iniciar/cerrar sesión
  const handleAuth = () => {
    if (user) {
      logout?.();
      navigate('/login');
    } else {
      navigate('/login');
    }
  };

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: NAV_BG }}>
        <Toolbar>
          {/* Logo y título */}
          <Box component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <Box component="img" src={Logo} alt="LumenGest" sx={{ height: 40, mr: 2 }} />
            <Typography
              variant="h6"
              sx={{
                color: TEXT_COLOR,
                fontFamily: `'Playfair Display', serif`,
                fontWeight: 700,
              }}
            >
              LumenGest
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          {/* Versión Móvil */}
          {isMobile ? (
            <>
              <IconButton onClick={toggleDrawer} sx={{ color: TEXT_COLOR }}>
                <MenuIcon />
              </IconButton>
              <Drawer anchor="right" open={open} onClose={toggleDrawer}>
                <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer}>
                  <List>
                    {links.map((l) => (
                      <ListItemButton component={Link} to={l.path} key={l.label}>
                        <ListItemText primary={l.label} />
                      </ListItemButton>
                    ))}
                    {/* Menú Administración (OPERADOR o ADMIN) en móvil */}
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
                            <ListItemButton component={Link} to="/RegistrarCliente">
                              <ListItemText primary="Ver auditoría" />
                            </ListItemButton>
                            <ListItemButton component={Link} to="/RegistrarCliente">
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
            /* Versión Desktop */
            <>
              {/* Enlaces generales */}
              {links.map((l) => (
                <NavLink to={l.path} key={l.label}>
                  {l.label}
                </NavLink>
              ))}

              {/* Menú de Administración */}
              {user && (user.rol === 'OPERADOR' || user.rol === 'ADMIN') && (
                <>
                  <Button
                    variant="text"
                    sx={{ color: TEXT_COLOR, ml: 3 }}
                    onClick={handleAdminMenuOpen}
                  >
                    Administración
                  </Button>
                  <Menu
                    anchorEl={adminAnchorEl}
                    open={Boolean(adminAnchorEl)}
                    onClose={handleAdminMenuClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  >
                    {[
                      <MenuItem
                        component={Link}
                        to="/RegistrarCliente"
                        onClick={handleAdminMenuClose}
                        key="registrar"
                      >
                        Registrar cliente
                      </MenuItem>,
                      ...(user.rol === 'ADMIN'
                        ? [
                            <MenuItem
                              component={Link}
                              to="/Usuarios"
                              onClick={handleAdminMenuClose}
                              key="usuarios"
                            >
                              Administrar usuarios
                            </MenuItem>,
                            <MenuItem
                              component={Link}
                              to="/RegistrarCliente"
                              onClick={handleAdminMenuClose}
                              key="auditoria"
                            >
                              Ver auditoría
                            </MenuItem>,
                            <MenuItem
                              component={Link}
                              to="/RegistrarCliente"
                              onClick={handleAdminMenuClose}
                              key="dashboard"
                            >
                              Dashboard
                            </MenuItem>,
                          ]
                        : []),
                    ]}
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
    </>
  );
}
