import React from 'react';
import { Box, Button, Card, CardContent, Container, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import ServicesIcon from '@mui/icons-material/VolunteerActivism';
import StarIcon from '@mui/icons-material/Star';
import { Link } from 'react-router-dom';
import {
  Section,
  Title,
  SubTitle,
  Paragraph,
  COLORS,
} from '../styles/HomeStyles';

export default function Home() {
  /* Datos de prueba */
  const servicios = [
    {
      icon: <ServicesIcon sx={{ fontSize: 40, color: COLORS.gold }} />,
      nombre: 'Cremación',
      ventaja: 'Proceso digno y respetuoso',
    },
    {
      icon: <ServicesIcon sx={{ fontSize: 40, color: COLORS.gold }} />,
      nombre: 'Entierro tradicional',
      ventaja: 'Acompañamiento integral',
    },
    {
      icon: <ServicesIcon sx={{ fontSize: 40, color: COLORS.gold }} />,
      nombre: 'Traslados nacionales',
      ventaja: 'Logística 24/7',
    },
  ];

  const noticias = [
    { titulo: 'Nueva sala de velatorios', fecha: '05‑2025', desc: 'Inauguramos un espacio más amplio y acogedor.' },
    { titulo: 'Convenio con seguros', fecha: '04‑2025', desc: 'Ahora aceptamos pólizas de las principales aseguradoras.' },
    { titulo: 'Descuento en planes anticipados', fecha: '03‑2025', desc: 'Ahorra hasta 15 % contratando online.' },
  ];

  return (
    <>
      {/* Sección de Bienvenida */}
      <Section style={{ backgroundColor: COLORS.light }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Title>Bienvenidos a LumenGest</Title>
              <Paragraph>
                Acompañamos a las familias en los momentos más delicados, ofreciendo 
                servicios funerarios integrales con calidez, respeto y transparencia.
              </Paragraph>
              <Button
                variant="contained"
                component={Link}
                to="/servicios"
                sx={{
                  mt: 3,
                  backgroundColor: COLORS.primary,
                  '&:hover': { backgroundColor: COLORS.brown },
                  fontFamily: `'Source Sans Pro', sans-serif`,
                }}
              >
                Cotizar ahora
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              {/* Aquí puedes colocar una imagen hero */}
              <Box
                sx={{
                  height: 260,
                  backgroundColor: COLORS.gold,
                  borderRadius: 3,
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Section>

      {/* Sección Acerca de Nosotros */}
      <Section>
        <Container maxWidth="md">
          <Title>Acerca de nosotros</Title>
          <SubTitle>Nuestra historia</SubTitle>
          <Paragraph>
            Fundada en 1995, LumenGest ha crecido hasta convertirse en referente regional 
            gracias a la confianza de más de 10 000 familias atendidas.
          </Paragraph>
          <SubTitle>Misión</SubTitle>
          <Paragraph>
            Brindar servicios funerarios humanizados y accesibles, apoyando a las familias 
            con empatía y profesionalismo.
          </Paragraph>
          <SubTitle>Visión</SubTitle>
          <Paragraph>
            Ser la empresa líder en innovación y calidad de servicios funerarios en el país 
            para 2030.
          </Paragraph>
        </Container>
      </Section>

      {/* Sección de Servicios */}
      <Section style={{ backgroundColor: COLORS.light }}>
        <Container maxWidth="lg">
          <Title>Nuestros servicios</Title>
          <Grid container spacing={3}>
            {servicios.map((s) => (
              <Grid item xs={12} sm={4} key={s.nombre}>
                <Card elevation={3} sx={{ textAlign: 'center', py: 4, borderRadius: 3 }}>
                  {s.icon}
                  <CardContent>
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: `'Merriweather', serif`,
                        fontWeight: 600,
                        color: COLORS.brown,
                      }}
                    >
                      {s.nombre}
                    </Typography>
                    <Paragraph>{s.ventaja}</Paragraph>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Section>

      {/* Sección de Novedades */}
      <Section>
        <Container maxWidth="md">
          <Title>Novedades</Title>
          {noticias.map((n) => (
            <Box
              key={n.titulo}
              sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}
            >
              <StarIcon sx={{ color: COLORS.gold, mr: 2 }} />
              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontFamily: `'Merriweather', serif`,
                    fontWeight: 600,
                    color: COLORS.primary,
                  }}
                >
                  {n.titulo} – {n.fecha}
                </Typography>
                <Paragraph>{n.desc}</Paragraph>
              </Box>
            </Box>
          ))}
        </Container>
      </Section>
    </>
  );
}
