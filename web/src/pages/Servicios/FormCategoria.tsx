// web/src/pages/Servicios/FormCategoria.tsx
import React, { useEffect } from 'react';
import { Box, Typography, TextField, Button, Alert } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { createCategoria, updateCategoria, getCategorias, Categoria } from '../../api/services';

type FormData = { nombre: string };

export default function FormCategoria() {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();
  const { register, handleSubmit, reset, formState } = useForm<FormData>({ defaultValues: { nombre: '' } });
  const [error, setError] = React.useState<string>();

  // Si vengo con id, precargar
  useEffect(() => {
    if (id) {
      getCategorias().then(list => {
        const cat = list.find(c => c.id === id);
        if (cat) reset({ nombre: cat.nombre });
      });
    }
  }, [id, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      if (id) await updateCategoria(id, data);
      else await createCategoria(data);
      nav('/servicios/categorias');
    } catch (e: any) {
      setError(e.message || 'Error');
    }
  };

  return (
    <Box sx={{ maxWidth: 480, mx: 'auto', mt: 4 }}>
      <Typography variant="h1" gutterBottom>
        { id ? 'Editar Categoría' : 'Nueva Categoría' }
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <TextField
          label="Nombre"
          fullWidth
          required
          sx={{ mb: 2 }}
          {...register('nombre', { required: true })}
        />
        <Button variant="contained" type="submit" fullWidth disabled={formState.isSubmitting}>
          Guardar
        </Button>
      </Box>
    </Box>
  );
}
