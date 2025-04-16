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

// Importa la imagen para el banner
import bannerImage from '../assets/inicio.png';

export default function Home() {
  // Datos de prueba para la sección de Servicios
  const servicios = [
    {
      icon: <ServicesIcon sx={{ fontSize: 40, color: COLORS.gold }} />,
      nombre: 'Cremación',
      ventaja: 'Un servicio digno y respetuoso, garantizando el cuidado en cada detalle.',
    },
    {
      icon: <ServicesIcon sx={{ fontSize: 40, color: COLORS.gold }} />,
      nombre: 'Entierro tradicional',
      ventaja: 'Acompañamiento integral para brindar el mejor consuelo a las familias.',
    },
    {
      icon: <ServicesIcon sx={{ fontSize: 40, color: COLORS.gold }} />,
      nombre: 'Traslados nacionales',
      ventaja: 'Logística 24/7 para garantizar traslados seguros y oportunos.',
    },
  ];

  // Datos de prueba para la sección de Novedades
  const noticias = [
    {
      titulo: 'Nueva sala de velatorios',
      fecha: '05‑2025',
      desc: 'Inauguramos un espacio moderno, amplio y acogedor para despedidas dignas.',
    },
    {
      titulo: 'Convenio con seguros',
      fecha: '04‑2025',
      desc: 'Establecemos alianzas estratégicas con las principales aseguradoras del país.',
    },
    {
      titulo: 'Descuento en planes anticipados',
      fecha: '03‑2025',
      desc: 'Ahorra hasta 15% contratando en línea y recibe atención prioritaria.',
    },
  ];

  return (
    <>
      {/* Sección de Bienvenida y Banner */}
      <Section sx={{ backgroundColor: COLORS.light, pt: 0 }}>
        <Box
          sx={{
            position: 'relative',
            height: { xs: 200, md: 400 },
            backgroundImage: `url(${bannerImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Capa de Overlay para mejorar la legibilidad */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              bgcolor: 'rgba(58, 69, 88, 0.6)', // usa COLORS.primary con opacidad
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Container maxWidth="lg">
              <Typography
                variant="h2"
                sx={{
                  color: '#fff',
                  fontFamily: `'Playfair Display', serif`,
                  fontWeight: 700,
                  textAlign: 'center',
                }}
              >
                Bienvenidos a LumenGest
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: '#fff',
                  mt: 2,
                  fontFamily: `'Source Sans Pro', sans-serif`,
                  textAlign: 'center',
                }}
              >
                Acompañamos a las familias en los momentos más delicados.
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Button
                  variant="contained"
                  component={Link}
                  to="/servicios"
                  sx={{
                    backgroundColor: COLORS.primary,
                    '&:hover': { backgroundColor: COLORS.brown },
                    fontFamily: `'Source Sans Pro', sans-serif`,
                    fontSize: '1.1rem',
                    px: 3,
                    py: 1.5,
                  }}
                >
                  Cotizar ahora
                </Button>
              </Box>
            </Container>
          </Box>
        </Box>
      </Section>

      {/* Sección Acerca de Nosotros */}
      <Section>
        <Container maxWidth="md">
          <Title>Acerca de nosotros</Title>
          <SubTitle>Nuestra historia</SubTitle>
          <Paragraph>
            Fundada en 1995, LumenGest ha crecido hasta convertirse en un referente regional,
            gracias a la confianza de más de 10.000 familias atendidas a lo largo de los años.
          </Paragraph>
          <SubTitle>Misión</SubTitle>
          <Paragraph>
            Brindar servicios funerarios humanizados y accesibles, cuidando cada detalle para apoyar 
            a las familias en momentos difíciles.
          </Paragraph>
          <SubTitle>Visión</SubTitle>
          <Paragraph>
            Ser la empresa líder en innovación y calidad de servicios funerarios, destacándonos por 
            nuestro compromiso con la excelencia y la empatía.
          </Paragraph>
        </Container>
      </Section>

      {/* Sección de Servicios */}
      <Section sx={{ backgroundColor: COLORS.light }}>
        <Container maxWidth="lg">
          <Title>Nuestros servicios</Title>
          <Grid container spacing={3}>
            {servicios.map((s) => (
              <Grid item xs={12} sm={4} key={s.nombre}>
                <Card
                  elevation={3}
                  sx={{ textAlign: 'center', py: 4, borderRadius: 3 }}
                >
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
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                mb: 3,
              }}
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
