// web/src/pages/Home.tsx
import { Container, Typography } from '@mui/material';

export default function Home() {
  return (
    <Container>
      <Container style={{ display: 'flex', width: '100%' }}>
        <Container style={{ flex: 1 }}>
          <img src="src/Imagen.png" alt="Imagen" style={{ width: '100%', height: 'auto' }} />
        </Container>
        <Container style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="h4">Bienvenido a LumenGest</Typography>
        </Container>
      </Container>
      <Container style={{ display: 'flex', width: '100%', marginTop: '20px' }}>
        <Container style={{ flex: 1, textAlign: 'center' }}>
          <Typography variant="h5">Quiénes somos</Typography>
        </Container>
        <Container style={{ flex: 1, textAlign: 'center' }}>
          <Typography variant="h5">Testimonios</Typography>
        </Container>
      </Container>
    </Container>
  );
}
//Bienvenido a LumenGest
