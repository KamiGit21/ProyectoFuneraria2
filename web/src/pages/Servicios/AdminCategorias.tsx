// web/src/pages/Servicios/AdminCategorias.tsx
import React, { useEffect } from 'react';
import { Box, Typography, Button, Grid, Card, CardContent, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAsync } from '../../hooks/useAsync';
import { getCategorias, deleteCategoria, Categoria } from '../../api/services';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

export default function AdminCategorias() {
  const nav = useNavigate();
  const { data: cats = [], run } = useAsync(getCategorias);

  // recarga lista
  useEffect(() => { run(); }, [run]);

  const onDelete = async (id: string) => {
    if (confirm('¿Borrar esta categoría?')) {
      await deleteCategoria(id);
      run();
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h1">Administrar Categorías</Typography>
        <Button variant="contained" onClick={() => nav('/servicios/categorias/nueva')}>
          Nueva categoría
        </Button>
      </Box>

      <Grid container spacing={2}>
        {cats.map((c: Categoria) => (
          <Grid item xs={12} sm={6} md={4} key={c.id}>
            <Card>
              <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography>{c.nombre}</Typography>
                <Box>
                  <IconButton onClick={() => nav(`/servicios/categorias/editar/${c.id}`)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => onDelete(c.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
