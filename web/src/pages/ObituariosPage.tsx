import React, { useState } from 'react';

import { 
  Box, 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  CardMedia, 
  Grid, 
  Button, 
  TextField,
  InputAdornment,
  IconButton,
  Divider,
  Chip
} from '@mui/material';
import { Search, Heart as Favorite, MessageCircle as Message, Calendar as CalendarToday, MapPin as LocationOn } from 'lucide-react';
import { useEffect } from 'react';
import ObituariosGrid from '../components/ObituariosGrid';
import ObituarioCard from '../components/ObituarioCard';

// Componentes estilizados
const PageTitle = ({ children }) => (
  <Typography 
    variant="h2" 
    sx={{ 
      fontFamily: `'Playfair Display', serif`,
      fontWeight: 700,
      color: '#6C4F4B',
      mb: 2,
      textAlign: 'center'
    }}
  >
    {children}
  </Typography>
);

const SubTitle = ({ children }) => (
  <Typography 
    variant="h5" 
    sx={{ 
      fontFamily: `'Playfair Display', serif`,
      fontWeight: 600,
      color: '#6C4F4B',
      mb: 1
    }}
  >
    {children}
  </Typography>
);

const Paragraph = ({ children }) => (
  <Typography 
    variant="body1" 
    sx={{ 
      color: '#333',
      mb: 2
    }}
  >
    {children}
  </Typography>
);


// Página principal
const ObituariosPage = () => {

  return (
    <Box sx={{ py: 5 }}>
      <Container>
        {/* Encabezado */}
        <Box 
          sx={{ 
            textAlign: 'center', 
            mb: 5,
            backgroundColor: '#F2EFEA',
            borderRadius: 2,
            p: 3,
            boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
          }}
        >
          <PageTitle>Obituarios y Homenajes</PageTitle>
          <Paragraph>
            Honramos la memoria de quienes han partido, celebrando sus vidas y legados. 
            Estos espacios digitales permiten a familiares y amigos compartir recuerdos, 
            condolencias y mensajes de apoyo.
          </Paragraph>
        </Box>
        
        {/* Resultados */}
        <ObituariosGrid/>
        
        {/* Sección informativa */}
        <Box 
          sx={{ 
            backgroundColor: '#6C4F4B', 
            color: '#F2EFEA',
            borderRadius: 2,
            p: 4,
            textAlign: 'center'
          }}
        >
          <Typography 
            variant="h4" 
            sx={{ 
              fontFamily: `'Playfair Display', serif`,
              fontWeight: 600,
              mb: 2
            }}
          >
            Crear un Homenaje
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Honra la memoria de tu ser querido creando un espacio digital permanente 
            donde familiares y amigos puedan compartir recuerdos, fotos y mensajes.
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              backgroundColor: '#F2EFEA',
              color: '#6C4F4B',
              borderRadius: 50,
              px: 4,
              '&:hover': { backgroundColor: '#e5e2d9' },
            }}
          >
            Iniciar Sesión para Crear
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default ObituariosPage;