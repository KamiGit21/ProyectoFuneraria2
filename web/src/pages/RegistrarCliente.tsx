// /web/src/pages/RegistrarCliente.tsx
import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Alert,
  Box,
} from '@mui/material';
import api from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

interface FormState {
  nombre_usuario: string;
  email: string;
  password: string;
  nombres: string;
  apellidos: string;
  telefono: string;
  direccion: string;
}

export default function RegistrarCliente() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>({
    nombre_usuario: '',
    email: '',
    password: '',
    nombres: '',
    apellidos: '',
    telefono: '',
    direccion: '',
  });
  const [error, setError] = useState('');
  const [ok, setOk] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setOk(false);
    try {
      await api.post('/clientes', form);
      setOk(true);
      setTimeout(() => navigate('/'), 1500);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al registrar cliente');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 8 }}>
        <Typography variant="h4" gutterBottom>
          Registrar Cliente
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {ok && <Alert severity="success" sx={{ mb: 2 }}>¡Cliente creado!</Alert>}

        {[
          { name: 'nombre_usuario', label: 'Usuario', required: true },
          { name: 'email', label: 'Email', required: true },
          { name: 'password', label: 'Contraseña', type: 'password', required: true },
          { name: 'nombres', label: 'Nombres', required: true },
          { name: 'apellidos', label: 'Apellidos', required: true },
          { name: 'telefono', label: 'Teléfono', required: false },
          { name: 'direccion', label: 'Dirección', required: false },
        ].map(field => (
          <TextField
            key={field.name}
            name={field.name}
            label={field.label}
            type={(field as any).type || 'text'}
            value={(form as any)[field.name]}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required={field.required}
          />
        ))}

        <Button
          variant="contained"
          type="submit"
          fullWidth
          sx={{ mt: 3, py: 1.5, fontSize: '1rem' }}
        >
          Guardar
        </Button>
      </Box>
    </Container>
  );
}
