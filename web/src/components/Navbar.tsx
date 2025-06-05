// web/src/components/Navbar.tsx
import React, { useContext, useState, useEffect } from 'react';
import {
  AppBar, Toolbar, Typography, IconButton, Button, Box,
  Drawer, List, ListItemButton, ListItemText,
  useMediaQuery, Theme, Menu, MenuItem, Tooltip, Badge,
} from '@mui/material';
import MenuIcon        from '@mui/icons-material/Menu';
import AccountCircle   from '@mui/icons-material/AccountCircle';
import PersonAddIcon   from '@mui/icons-material/PersonAdd';
import ShoppingCart    from '@mui/icons-material/ShoppingCart';
import { styled, keyframes } from '@mui/system';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import { AuthContext } from '../contexts/AuthContext';
import { useCart }     from '../contexts/CartContext';
import Logo            from '../assets/Logo_B.png';

/* ---------- estilos rápidos ---------- */
const NAV_BG     = '#3A4A58';
const TEXT_COLOR = '#FFFFFF';

const NavLink = styled(Link)({
  color: TEXT_COLOR,
  textDecoration: 'none',
  fontFamily: `'Source Sans Pro', sans-serif`,
  fontWeight: 600,
});

const bump = keyframes`
  0%{transform:scale(1)}20%{transform:scale(1.2)}
  40%{transform:scale(.9)}60%{transform:scale(1.05)}
  100%{transform:scale(1)}
`;

export default function Navbar() {
  const { user, logout } = useContext(AuthContext) ?? {};
  const { items, clear } = useCart(); // <-- Extraemos clear() aquí
  const nav  = useNavigate();
  const loc  = useLocation();
  const isMb = useMediaQuery((t: Theme) => t.breakpoints.down('md'));

  const itemCount = items.reduce((a, l) => a + l.cantidad, 0);
  const [bumpCart, setBumpCart] = useState(false);
  useEffect(() => {
    if (itemCount === 0) return;
    setBumpCart(true);
    const t = setTimeout(() => setBumpCart(false), 300);
    return () => clearTimeout(t);
  }, [itemCount]);

  const [drawer, setDrawer]      = useState(false);
  const [adminAnchor, setAdmA]   = useState<HTMLElement | null>(null);

  const scrollAbout = () => {
    if (loc.pathname !== '/') nav('/');
    setTimeout(() =>
      document.getElementById('quienes-somos')
              ?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  // Modificamos doLogout para vaciar el carrito antes de cerrar sesión
  const doLogout = () => {
    clear();        // <-- Vaciamos el carrito del usuario actual
    logout?.();     
    nav('/login');
  };

  const links: { label: string; path?: string; action?: () => void }[] = [
    { label: 'Servicios',     path: '/servicios' },
    { label: 'Quiénes somos', action: scrollAbout },
    { label: 'Contacto',      path: '/contacto'  },
    { label: 'Obituarios',    path: '/obituarios'},
  ];

  const adminItems = user?.rol === 'ADMIN'
    ? [
        { to: '/servicios/categorias', txt: 'Categorías' },
        { to: '/Usuarios',             txt: 'Administrar usuarios' },
        { to: '/Auditoria',            txt: 'Ver auditoría' },
        { to: '/Dashboard',            txt: 'Dashboard' },
      ]
    : null;

  const CartBtn = () =>
    user && (user.rol === 'CLIENTE' || user.rol === 'OPERADOR') && (
      <Tooltip title="Mi carrito">
        <IconButton 
          sx={{ color: TEXT_COLOR }}
          onClick={() => nav('/checkout')}
        >
          <Badge
            color="error"
            badgeContent={itemCount}
            overlap="circular"
            invisible={itemCount === 0}
          >
            <ShoppingCart sx={bumpCart ? { animation: `${bump} 300ms ease-out` } : undefined}/>
          </Badge>
        </IconButton>
      </Tooltip>
    );

  const RegCliBtn = () =>
    user && (user.rol === 'OPERADOR' || user.rol === 'ADMIN') && (
      <Button
        startIcon={<PersonAddIcon />}
        sx={{ color: TEXT_COLOR, fontWeight: 600 }}
        onClick={() => nav('/RegistrarCliente')}
      >
        Registrar cliente
      </Button>
    );

  return (
    /* Cambiamos a position="sticky" para que se quede arriba al hacer scroll */
    <AppBar 
      position="sticky" 
      sx={{ 
        backgroundColor: NAV_BG, 
        top: 0, 
        zIndex: (theme) => theme.zIndex.appBar 
      }}
    >
      {/* Aumentamos el minHeight para que el navbar sea más “alto” */}
      <Toolbar sx={{ minHeight: 80 }}>
        {/* logo ---------------------------------------------------- */}
        <Box 
          component={Link} 
          to="/" 
          sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
        >
          <Box component="img" src={Logo} alt="LumenGest" sx={{ height: 40, mr: 2 }} />
          <Typography 
            variant="h6" 
            sx={{ color: TEXT_COLOR, fontFamily: `'Playfair Display'`, fontWeight: 700 }}
          >
            LumenGest
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {isMb ? (
          <>
            <IconButton sx={{ color: TEXT_COLOR }} onClick={() => setDrawer(true)}>
              <MenuIcon />
            </IconButton>

            <Drawer anchor="right" open={drawer} onClose={() => setDrawer(false)}>
              <Box sx={{ width: 250 }} role="presentation" onClick={() => setDrawer(false)}>
                <List>
                  {links.map(l =>
                    l.path ? (
                      <ListItemButton key={l.label} component={Link} to={l.path}>
                        <ListItemText primary={l.label} primaryTypographyProps={{ fontWeight: 600 }}/>
                      </ListItemButton>
                    ) : (
                      <ListItemButton key={l.label} onClick={l.action}>
                        <ListItemText primary={l.label} primaryTypographyProps={{ fontWeight: 600 }}/>
                      </ListItemButton>
                    )
                  )}

                  {(user?.rol === 'CLIENTE' || user?.rol === 'OPERADOR') && (
                    <ListItemButton component={Link} to="/checkout">
                      <ShoppingCart sx={{ mr: 1 }}/>
                      <ListItemText
                        primary={`Mi carrito (${itemCount})`}
                        primaryTypographyProps={{ fontWeight: 600 }}
                      />
                    </ListItemButton>
                  )}

                  {(user?.rol === 'OPERADOR' || user?.rol === 'ADMIN') && (
                    <ListItemButton component={Link} to="/RegistrarCliente">
                      <PersonAddIcon sx={{ mr: 1 }}/>
                      <ListItemText primary="Registrar cliente" primaryTypographyProps={{ fontWeight: 600 }}/>
                    </ListItemButton>
                  )}

                  {adminItems?.map(i => (
                    <ListItemButton key={i.to} component={Link} to={i.to}>
                      <ListItemText primary={i.txt} primaryTypographyProps={{ fontWeight: 600 }}/>
                    </ListItemButton>
                  ))}

                  <ListItemButton onClick={doLogout}>
                    <AccountCircle sx={{ mr: 1 }}/>
                    <ListItemText
                      primary={user ? 'Cerrar sesión' : 'Iniciar sesión'}
                      primaryTypographyProps={{ fontWeight: 600 }}
                    />
                  </ListItemButton>
                </List>
              </Box>
            </Drawer>
          </>
        ) : (
        /* ------------------------ DESKTOP ----------------------- */
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              {links.map(l =>
                l.path ? (
                  <NavLink key={l.label} to={l.path}>{l.label}</NavLink>
                ) : (
                  <Button
                    key={l.label}
                    onClick={l.action}
                    sx={{ color: TEXT_COLOR, fontWeight: 600 }}
                  >
                    {l.label}
                  </Button>
                )
              )}

              <CartBtn />
              <RegCliBtn />

              {adminItems?.length ? (
                <>
                  <Button
                    sx={{ color: TEXT_COLOR, fontWeight: 600 }}
                    onClick={e => setAdmA(e.currentTarget)}
                  >
                    Administración
                  </Button>
                  <Menu
                    anchorEl={adminAnchor}
                    open={Boolean(adminAnchor)}
                    onClose={() => setAdmA(null)}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  >
                    {adminItems.map(i => (
                      <MenuItem
                        key={i.to}
                        component={Link}
                        to={i.to}
                        onClick={() => setAdmA(null)}
                        sx={{ fontWeight: 600 }}
                      >
                        {i.txt}
                      </MenuItem>
                    ))}
                  </Menu>
                </>
              ) : null}

              <Button
                startIcon={<AccountCircle />}
                sx={{ color: TEXT_COLOR, fontWeight: 600 }}
                onClick={doLogout}
              >
                {user ? 'Cerrar sesión' : 'Iniciar sesión'}
              </Button>
            </Box>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}
