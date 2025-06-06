import { useEffect, useState } from 'react';
import ObituarioCard from './ObituarioCard';
// Usando fetch directamente ya que tenemos problemas con la importación de api
// import api from './axiosInstance';

import { 
  Box, 
  Typography, 
  Grid, 
  Divider,
  Alert
} from '@mui/material';

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

type Obituario = {
  id: string;
  titulo: string;
  mensaje?: string;
  imagen_url?: string;
};

const ObituariosGrid: React.FC = () => {
  const [obituarios, setObituarios] = useState<Obituario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchObituarios = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/obituarios');
        if (!response.ok) {
          throw new Error('Error al cargar los obituarios');
        }
        const data = await response.json();
        setObituarios(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchObituarios();
  }, []);

  if (loading) return <p>Cargando obituarios...</p>;
  if (error) return <p>Error: {error}</p>;
  return (
    <Box sx={{ mb: 4 }}>
      <SubTitle>Homenajes Recientes</SubTitle>
      <Divider sx={{ mb: 3 }} />
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {loading ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography>Cargando homenajes...</Typography>
        </Box>
      ) : obituarios.length > 0 ? (
        <Grid container spacing={3}>
          {obituarios.map((obituario) => (
            <Grid item xs={12} sm={6} md={4} key={obituario.id}>
              <ObituarioCard
                key={obituario.id}
                titulo={obituario.titulo}
                mensaje={obituario.mensaje}
                imagen_url={obituario.imagen_url}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box 
          sx={{ 
            textAlign: 'center', 
            py: 8, 
            backgroundColor: '#f9f9f9',
            borderRadius: 2
          }}
        >
          <Typography variant="h6" color="text.secondary">
            No se encontraron obituarios que coincidan con tu búsqueda.
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default ObituariosGrid;