import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  Paper, 
  Card, 
  CardContent,
  Divider
} from '@mui/material';
import { LocationOn, Phone, Email, AccessTime } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Importa la imagen del logo (asumiendo que viene del mismo lugar que en tu código original)
import logo from '../assets/Logo_B.png';

// Componentes de estilo reutilizables
const Title = ({ children, ...props }) => (
  <Typography
    variant="h2"
    sx={{
      color: '#B59F6B',
      fontFamily: `'Playfair Display', serif`,
      fontWeight: 700,
      mb: 3,
      ...props?.sx
    }}
    {...props}
  >
    {children}
  </Typography>
);

const SubTitle = ({ children, ...props }) => (
  <Typography
    variant="h3"
    sx={{
      color: '#6C4F4B',
      fontFamily: `'Playfair Display', serif`,
      fontWeight: 600,
      mb: 2,
      fontSize: '1.8rem',
      ...props?.sx
    }}
    {...props}
  >
    {children}
  </Typography>
);

const Paragraph = ({ children, ...props }) => (
  <Typography
    variant="body1"
    sx={{
      color: '#6C4F4B',
      fontFamily: `'Roboto', sans-serif`,
      fontSize: '1.1rem',
      mb: 2,
      lineHeight: 1.6,
      ...props?.sx
    }}
    {...props}
  >
    {children}
  </Typography>
);

const ContactItem = ({ icon, primary, secondary }) => (
  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
    <Box sx={{ mr: 2, color: '#B59F6B' }}>
      {icon}
    </Box>
    <Box>
      <Typography 
        variant="body1" 
        sx={{ 
          fontFamily: `'Roboto', sans-serif`, 
          fontWeight: 500, 
          color: '#6C4F4B' 
        }}
      >
        {primary}
      </Typography>
      <Typography 
        variant="body2" 
        sx={{ 
          fontFamily: `'Roboto', sans-serif`, 
          color: '#6C4F4B' 
        }}
      >
        {secondary}
      </Typography>
    </Box>
  </Box>
);

function Contacto() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    asunto: '',
    mensaje: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica para manejar el envío del formulario
    console.log('Formulario enviado:', formData);
    // Aquí iría la lógica para enviar el formulario al backend
    alert('Gracias por contactarnos. Le responderemos a la brevedad.');
    // Reinicia el formulario
    setFormData({
      nombre: '',
      email: '',
      telefono: '',
      asunto: '',
      mensaje: ''
    });
  };

  // Horarios de atención
  const horarios = [
    { dia: 'Lunes a Viernes', horas: '08:00 - 20:00' },
    { dia: 'Sábados', horas: '09:00 - 14:00' },
    { dia: 'Domingos', horas: '10:00 - 13:00' },
    { dia: 'Emergencias', horas: '24 horas' }
  ];

  // Sucursales
  const sucursales = [
    {
      nombre: 'Sede Principal',
      direccion: 'Av. San Martín 1234, Ciudad Centro',
      telefono: '(+54) 11 4567-8901',
      email: 'principal@lumengest.com'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Cabecera */}
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 6,
          backgroundColor: '#F2EFEA',
          borderRadius: 2,
          p: 4,
          boxShadow: 1
        }}
      >
        <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
          <Typography
            variant="h1"
            sx={{
              color: '#B59F6B',
              fontFamily: `'Playfair Display', serif`,
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: '2.5rem', md: '3rem' }
            }}
          >
            CONTÁCTENOS
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#6C4F4B',
              fontFamily: `'Roboto', sans-serif`,
              fontSize: '1.2rem',
              mb: 2,
              maxWidth: '600px',
              lineHeight: 1.8,
              borderLeft: '4px solid #B59F6B',
              pl: 2,
            }}
          >
            Estamos aquí para asistirle en todo momento. Nuestro equipo está disponible para responder cualquier consulta sobre nuestros servicios y brindarle el apoyo que necesita en momentos difíciles.
          </Typography>
        </Box>
        <Box
          component="img"
          src={logo}
          alt="Logo LumenGest"
          sx={{ 
            height: { xs: 150, md: 200 }, 
            width: 'auto',
            mt: { xs: 3, md: 0 }
          }}
        />
      </Box>

      {/* Contenido principal - Formulario y datos de contacto */}
      <Grid container spacing={4}>
        {/* Formulario de contacto */}
        <Grid item xs={12} md={7}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              borderRadius: 2,
              backgroundColor: '#F2EFEA'
            }}
          >
            <Title sx={{ textAlign: 'center' }}>Envíenos un mensaje</Title>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Nombre completo"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    sx={{ mb: 2 }}
                    InputLabelProps={{ style: { color: '#6C4F4B' } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Teléfono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    sx={{ mb: 2 }}
                    InputLabelProps={{ style: { color: '#6C4F4B' } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Correo electrónico"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    sx={{ mb: 2 }}
                    InputLabelProps={{ style: { color: '#6C4F4B' } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Asunto"
                    name="asunto"
                    value={formData.asunto}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    sx={{ mb: 2 }}
                    InputLabelProps={{ style: { color: '#6C4F4B' } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Mensaje"
                    name="mensaje"
                    value={formData.mensaje}
                    onChange={handleChange}
                    required
                    multiline
                    rows={4}
                    variant="outlined"
                    sx={{ mb: 3 }}
                    InputLabelProps={{ style: { color: '#6C4F4B' } }}
                  />
                </Grid>
                <Grid item xs={12} sx={{ textAlign: 'center' }}>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      backgroundColor: '#6C4F4B',
                      color: '#F2EFEA',
                      borderRadius: 50,
                      px: 6,
                      py: 1.5,
                      fontSize: '1rem',
                      '&:hover': { backgroundColor: '#A48E5F' },
                    }}
                  >
                    Enviar mensaje
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>

        {/* Información de contacto */}
        <Grid item xs={12} md={5}>
          <Box sx={{ height: '100%' }}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 4, 
                borderRadius: 2,
                backgroundColor: '#F2EFEA',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <SubTitle>Información de contacto</SubTitle>
              
              <ContactItem 
                icon={<Phone fontSize="large" />}
                primary="Línea de atención 24/7"
                secondary="(+54) 11 5555-7890"
              />
              
              <ContactItem 
                icon={<Email fontSize="large" />}
                primary="Correo electrónico"
                secondary="contacto@lumengest.com"
              />
              
              <ContactItem 
                icon={<LocationOn fontSize="large" />}
                primary="Dirección principal"
                secondary="Av. San Martín 1234, Ciudad Centro"
              />
              
              <ContactItem 
                icon={<AccessTime fontSize="large" />}
                primary="Horarios de atención"
                secondary="Lunes a Viernes: 8:00 - 20:00"
              />
              
              <Box sx={{ mt: 'auto' }}>
                <Typography
                  variant="body1"
                  sx={{
                    fontFamily: `'Roboto', sans-serif`,
                    fontWeight: 500,
                    color: '#6C4F4B',
                    borderLeft: '4px solid #B59F6B',
                    pl: 2,
                    py: 1,
                  }}
                >
                  Para emergencias fuera de horario, contáctenos a nuestra línea de asistencia 24/7.
                </Typography>
              </Box>
            </Paper>
          </Box>
        </Grid>
      </Grid>

      {/* Sección de Horarios y Sucursales */}
      <Box sx={{ mt: 6 }}>
        <Grid container spacing={4}>
          {/* Horarios */}
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 4, 
                borderRadius: 2,
                backgroundColor: '#6C4F4B',
                color: '#F2EFEA',
                height: '100%'
              }}
            >
              <Typography
                variant="h3"
                sx={{
                  fontFamily: `'Playfair Display', serif`,
                  fontWeight: 600,
                  mb: 3,
                  fontSize: '1.8rem',
                  textAlign: 'center'
                }}
              >
                Horarios de atención
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {horarios.map((horario, index) => (
                  <Box 
                    key={index} 
                    sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      py: 1,
                      borderBottom: index < horarios.length - 1 ? '1px solid #F2EFEA' : 'none'
                    }}
                  >
                    <Typography 
                      sx={{ 
                        fontFamily: `'Roboto', sans-serif`,
                        fontWeight: index === 3 ? 700 : 400,
                        fontSize: '1.1rem'
                      }}
                    >
                      {horario.dia}:
                    </Typography>
                    <Typography 
                      sx={{ 
                        fontFamily: `'Roboto', sans-serif`,
                        fontWeight: index === 3 ? 700 : 400,
                        fontSize: '1.1rem'
                      }}
                    >
                      {horario.horas}
                    </Typography>
                  </Box>
                ))}
              </Box>
              
              <Box 
                sx={{ 
                  mt: 4, 
                  textAlign: 'center', 
                  backgroundColor: '#B59F6B',
                  borderRadius: 2,
                  p: 2
                }}
              >
                <Typography 
                  sx={{ 
                    fontFamily: `'Roboto', sans-serif`,
                    fontWeight: 700,
                    fontSize: '1.1rem'
                  }}
                >
                  Número de Emergencias: (+54) 11 5555-0000
                </Typography>
              </Box>
            </Paper>
          </Grid>
          
          {/* Sucursales */}
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 4, 
                borderRadius: 2,
                backgroundColor: '#F2EFEA',
                height: '100%'
              }}
            >
              <SubTitle sx={{ textAlign: 'center' }}>Nuestra sucursal</SubTitle>
              
              <Grid container spacing={3}>
                {sucursales.map((sucursal, index) => (
                  <Grid item xs={12} key={index}>
                    <Card sx={{ backgroundColor: '#F8F5F1', boxShadow: 2 }}>
                      <CardContent>
                        <Typography 
                          variant="h4" 
                          sx={{ 
                            fontFamily: `'Playfair Display', serif`,
                            color: '#B59F6B',
                            fontWeight: 600,
                            mb: 2,
                            fontSize: '1.4rem'
                          }}
                        >
                          {sucursal.nombre}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <LocationOn sx={{ color: '#6C4F4B', mr: 1, fontSize: '1.2rem' }} />
                          <Typography 
                            sx={{ 
                              fontFamily: `'Roboto', sans-serif`,
                              color: '#6C4F4B',
                            }}
                          >
                            {sucursal.direccion}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Phone sx={{ color: '#6C4F4B', mr: 1, fontSize: '1.2rem' }} />
                          <Typography 
                            sx={{ 
                              fontFamily: `'Roboto', sans-serif`,
                              color: '#6C4F4B',
                            }}
                          >
                            {sucursal.telefono}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Email sx={{ color: '#6C4F4B', mr: 1, fontSize: '1.2rem' }} />
                          <Typography 
                            sx={{ 
                              fontFamily: `'Roboto', sans-serif`,
                              color: '#6C4F4B',
                            }}
                          >
                            {sucursal.email}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Mapa (representado con un placeholder) */}
      <Box 
        sx={{ 
          mt: 6, 
          backgroundColor: '#F2EFEA',
          p: 3,
          borderRadius: 2,
          boxShadow: 3
        }}
      >
        <Title sx={{ textAlign: 'center' }}>Encuéntrenos</Title>
        <Box 
          sx={{ 
            width: '100%', 
            height: '400px', 
            backgroundColor: '#E5E0DA',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 1,
            border: '2px solid #B59F6B'
          }}
        >
          <Typography 
            sx={{ 
              fontFamily: `'Roboto', sans-serif`,
              color: '#6C4F4B',
              fontStyle: 'italic'
            }}
          >
            [Aquí se mostraría el mapa de ubicación]
          </Typography>
        </Box>
      </Box>

      {/* Sección Final - CTA */}
      <Box 
        sx={{ 
          mt: 6, 
          backgroundColor: '#6C4F4B',
          p: 4,
          borderRadius: 2,
          textAlign: 'center',
          color: '#F2EFEA'
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontFamily: `'Playfair Display', serif`,
            fontWeight: 600,
            mb: 2,
            fontSize: '1.8rem',
          }}
        >
          Estamos para servirle
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontFamily: `'Roboto', sans-serif`,
            fontSize: '1.2rem',
            mb: 3,
            maxWidth: '800px',
            mx: 'auto'
          }}
        >
          En LumenGest entendemos lo importante que es contar con apoyo en momentos difíciles. Nuestro equipo está disponible para responder a todas sus consultas.
        </Typography>
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#B59F6B',
            color: '#F2EFEA',
            borderRadius: 50,
            px: 6,
            py: 1.5,
            fontSize: '1rem',
            '&:hover': { backgroundColor: '#8E7C52' },
            mb: 2
          }}
          onClick={() => navigate('/Cotizacion')}
        >
          Solicitar cotización
        </Button>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          {['Profesionalismo', 'Empatía', 'Confianza', 'Disponibilidad'].map((word, index) => (
            <React.Fragment key={index}>
              <Typography 
                sx={{ 
                  fontFamily: `'Roboto', sans-serif`,
                  fontWeight: 500,
                  mx: 1
                }}
              >
                {word}
              </Typography>
              {index < 3 && (
                <Divider orientation="vertical" flexItem sx={{ borderColor: '#B59F6B' }} />
              )}
            </React.Fragment>
          ))}
        </Box>
      </Box>
    </Container>
  );
}

export default Contacto;
