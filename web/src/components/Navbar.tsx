// web/src/components/Navbar.tsx
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
  import Logo from '../assets/Logo B.png'; // Asegúrate de que la ruta sea correcta
  
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
  
    // Drawer state (versión móvil)
    const [open, setOpen] = useState(false);
    const toggleDrawer = () => setOpen(!open);
  
    // Para el menú de administración (desktop)
    const [adminAnchorEl, setAdminAnchorEl] = useState<null | HTMLElement>(null);
    const handleAdminMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
      setAdminAnchorEl(event.currentTarget);
    };
    const handleAdminMenuClose = () => {
      setAdminAnchorEl(null);
    };
  
    // Enlaces generales
    const links = [
      { label: 'Servicios', path: '/servicios' },
      { label: 'Obituarios', path: '/obituarios' },
      { label: 'Contacto', path: '/contacto' },
      { label: 'Quiénes somos', path: '/' },
    ];
  
    // Función para manejar el botón de autenticar
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
  
            {/* Espaciador */}
            <Box sx={{ flexGrow: 1 }} />
  
            {isMobile ? (
              <>
                {/* Botón hamburguesa para móviles */}
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
                      {/* Administración: visible solo para OPERADOR o ADMIN */}
                      {user && (user.rol === 'OPERADOR' || user.rol === 'ADMIN') && (
                        <>
                          <ListItemButton component={Link} to="/RegistrarCliente">
                            <ListItemText primary="Registrar cliente" />
                          </ListItemButton>
                          {user.rol === 'ADMIN' && (
                            <>
                              <ListItemButton component={Link} to="/AdministrarUsuarios">
                                <ListItemText primary="Administrar usuarios" />
                              </ListItemButton>
                              <ListItemButton component={Link} to="/VerAuditoria">
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
                {/* Enlaces generales para desktop */}
                {links.map((l) => (
                  <NavLink to={l.path} key={l.label}>
                    {l.label}
                  </NavLink>
                ))}
  
                {/* Menú Administración: solo para usuarios con rol OPERADOR o ADMIN */}
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
                      <MenuItem component={Link} to="/RegistrarCliente" onClick={handleAdminMenuClose}>
                        Registrar cliente
                      </MenuItem>
                      {user.rol === 'ADMIN' && (
                        <>
                          <MenuItem component={Link} to="/AdministrarUsuarios" onClick={handleAdminMenuClose}>
                            Administrar usuarios
                          </MenuItem>
                          <MenuItem component={Link} to="/VerAuditoria" onClick={handleAdminMenuClose}>
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
      </>
    );
  }
  