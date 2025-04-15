import { useState, useContext } from 'react';
import { Box, Button, Container, TextField, Typography, Alert, Link } from '@mui/material';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPwd] = useState('');
  const [error, setError] = useState('');
  
  // Accedemos al contexto y verificamos que no sea null
  const authCtx = useContext(AuthContext);
  if (!authCtx) {
    return <div>Error en la configuración del contexto</div>;
  }
  const { login } = authCtx;

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/auth/login', { email, password });
      login(data.usuario, data.token);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al iniciar sesión');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 10 }}>
        <Typography variant="h1" gutterBottom>
          Iniciar Sesión
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          label="Correo"
          fullWidth
          margin="normal"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <TextField
          label="Contraseña"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={e => setPwd(e.target.value)}
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 2, fontSize: '1.2rem', py: 1.5 }}
        >
          Entrar
        </Button>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Link href="#" underline="hover">
            Olvidé mi contraseña
          </Link>
          <Link href="#" underline="hover">
            Registrarse
          </Link>
        </Box>
      </Box>
    </Container>
  );
}
