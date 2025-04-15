import { useState } from 'react';
import {
  Container, TextField, Button, Typography, Alert, Box
} from '@mui/material';
import api from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

export default function RegistrarCliente() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombres: '', apellidos: '', email: '',
    telefono: '', direccion: '', password: ''
  });
  const [error, setError] = useState('');
  const [ok, setOk] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setOk(false);
    try {
      await api.post('/clientes', form);
      setOk(true);
      setTimeout(() => navigate('/'), 1500);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 8 }}>
        <Typography variant="h2" gutterBottom>Registrar cliente</Typography>

        {error && <Alert severity="error">{error}</Alert>}
        {ok && <Alert severity="success">¡Cliente creado!</Alert>}

        {['nombres','apellidos','email','telefono','direccion','password'].map((f,i)=>(
          <TextField
            key={f}
            name={f}
            label={f.charAt(0).toUpperCase()+f.slice(1)}
            type={f==='password'?'password':'text'}
            value={(form as any)[f]}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required={i<4 || f==='password'}
          />
        ))}

        <Button variant="contained" type="submit" fullWidth sx={{ mt: 2, py: 1.2 }}>
          Guardar
        </Button>
      </Box>
    </Container>
  );
}
