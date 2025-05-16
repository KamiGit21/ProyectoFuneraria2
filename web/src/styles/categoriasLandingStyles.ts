import { SxProps, Theme } from '@mui/material';

/* ----------- GRID CONTENEDOR ------------------------------------------- */
export const gridContainer: SxProps<Theme> = {
  mt: 4,
  display: 'grid',
  gap: 2,                                   // 16 px
  gridTemplateColumns: {
    xs: 'repeat(2, 1fr)',                   // 2 col. en móvil
    sm: 'repeat(3, 1fr)',                   // 3 col. en ≥ 600 px
    md: 'repeat(4, 1fr)',                   // 4 col. en ≥ 900 px
  },
};

/* ----------- TARJETA ---------------------------------------------------- */
export const cardRoot: SxProps<Theme> = {
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
};

/* ActionArea ocupa toda la tarjeta */
export const actionArea: SxProps<Theme> = { height: '100%' };

/* Contenido centrado */
export const contentBox: SxProps<Theme> = {
  flexGrow: 1,
  p: 4,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
};

/* Título con tamaño fluido */
export const title: SxProps<Theme> = {
  fontFamily: `'Merriweather', serif`,
  fontWeight: 600,
  fontSize: {
    xs: '1.1rem',
    sm: '1.2rem',
    md: '1.3rem',
  },
};
