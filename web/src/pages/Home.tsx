// web/src/pages/Home.tsx
import { Container, Typography } from '@mui/material';

export default function Home() {
  return (
    <Container maxWidth="md" sx={{ mt: 10 }}>
      <Typography variant="h2" gutterBottom>
        Bienvenido a LumenGest
      </Typography>
      <Typography variant="body1">
        Esta es la página principal (Home). ¡Prueba que la navegación funciona correctamente!
      </Typography>
    </Container>
  );
}
