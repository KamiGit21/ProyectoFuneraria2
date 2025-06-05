import React, { useEffect, useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import {
  getDashboardMetrics,
  getVelatoriosMetrics,
  getServiciosMetrics,
  getInventarioMetrics,
  getUsuarioMetrics,
  DashboardMetrics,
  VelatoriosMetrics,
  ServiciosMetrics,
  InventarioMetrics,
  UsuarioMetrics,
} from '../api/dashboard';
import Reportes from './Reportes';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const sidebarLinks = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Velatorios', path: '/dashboard/velatorios' },
  { label: 'Inventario', path: '/dashboard/inventario' },
  { label: 'Servicios', path: '/dashboard/servicios' },
  { label: 'Reportes', path: '/dashboard/reportes' },
  { label: 'Usuario', path: '/dashboard/usuario' },
];

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { position: 'top' as const },
    title: { display: true, text: '' },
  },
};

const chartColors = {
  barBackground: '#B59F6B',
  barBorder: '#6C4F4B',
  pieBackground: ['#B59F6B', '#6C4F4B', '#A48E5F', '#F2EFEA', '#D4C4A1'],
  pieBorder: '#F2EFEA',
};

const Dashboard: React.FC = () => {
  const location = useLocation();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [velatoriosMetrics, setVelatoriosMetrics] = useState<VelatoriosMetrics | null>(null);
  const [serviciosMetrics, setServiciosMetrics] = useState<ServiciosMetrics | null>(null);
  const [inventarioMetrics, setInventarioMetrics] = useState<InventarioMetrics | null>(null);
  const [usuarioMetrics, setUsuarioMetrics] = useState<UsuarioMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        if (location.pathname === '/dashboard') {
          const data = await getDashboardMetrics();
          setMetrics(data);
        } else if (location.pathname === '/dashboard/velatorios') {
          const data = await getVelatoriosMetrics();
          setVelatoriosMetrics(data);
        } else if (location.pathname === '/dashboard/inventario') {
          const data = await getInventarioMetrics();
          setInventarioMetrics(data);
        } else if (location.pathname === '/dashboard/servicios') {
          const data = await getServiciosMetrics();
          setServiciosMetrics(data);
        } else if (location.pathname === '/dashboard/usuario') {
          const data = await getUsuarioMetrics();
          setUsuarioMetrics(data);
        }
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchData();
  }, [location.pathname]);

  // Dashboard Charts
  const dashboardBarChart = {
    type: 'bar' as const,
    data: {
      labels: metrics?.services.map((m) => m.month) || [],
      datasets: [
        {
          label: 'Servicios por Mes',
          data: metrics?.services.map((m) => m.value) || [],
          backgroundColor: chartColors.barBackground,
          borderColor: chartColors.barBorder,
          borderWidth: 1,
        },
      ],
    },
    options: {
      ...chartOptions,
      plugins: { ...chartOptions.plugins, title: { ...chartOptions.plugins.title, text: 'Servicios por Mes' } },
    },
  };

  const dashboardRevenuePieChart = {
    type: 'pie' as const,
    data: {
      labels: metrics?.revenue.map((m) => m.month) || [],
      datasets: [
        {
          label: 'Ingresos por Mes',
          data: metrics?.revenue.map((m) => m.value) || [],
          backgroundColor: chartColors.pieBackground,
          borderColor: chartColors.pieBorder,
          borderWidth: 1,
        },
      ],
    },
    options: {
      ...chartOptions,
      plugins: { ...chartOptions.plugins, title: { ...chartOptions.plugins.title, text: 'Ingresos por Mes' } },
    },
  };

  const dashboardObituariesPieChart = {
    type: 'pie' as const,
    data: {
      labels: metrics?.obituaries.map((m) => m.month) || [],
      datasets: [
        {
          label: 'Obituarios Publicados',
          data: metrics?.obituaries.map((m) => m.value) || [],
          backgroundColor: chartColors.pieBackground,
          borderColor: chartColors.pieBorder,
          borderWidth: 1,
        },
      ],
    },
    options: {
      ...chartOptions,
      plugins: { ...chartOptions.plugins, title: { ...chartOptions.plugins.title, text: 'Obituarios Publicados' } },
    },
  };

  // Velatorios Charts
  const velatoriosBarChart = {
    type: 'bar' as const,
    data: {
      labels: velatoriosMetrics?.byMonth.map((m) => m.month) || [],
      datasets: [
        {
          label: 'Reservas por Mes',
          data: velatoriosMetrics?.byMonth.map((m) => m.count) || [],
          backgroundColor: chartColors.barBackground,
          borderColor: chartColors.barBorder,
          borderWidth: 1,
        },
      ],
    },
    options: {
      ...chartOptions,
      plugins: { ...chartOptions.plugins, title: { ...chartOptions.plugins.title, text: 'Reservas por Mes' } },
    },
  };

  const velatoriosPieChart = {
    type: 'pie' as const,
    data: {
      labels: velatoriosMetrics?.byDay.map((m) => m.day) || [],
      datasets: [
        {
          label: 'Reservas por Día',
          data: velatoriosMetrics?.byDay.map((m) => m.count) || [],
          backgroundColor: chartColors.pieBackground,
          borderColor: chartColors.pieBorder,
          borderWidth: 1,
        },
      ],
    },
    options: {
      ...chartOptions,
      plugins: { ...chartOptions.plugins, title: { ...chartOptions.plugins.title, text: 'Reservas por Día' } },
    },
  };

  // Servicios Charts
  const serviciosBarChart = {
    type: 'bar' as const,
    data: {
      labels: serviciosMetrics?.byMonth ? [...new Set(serviciosMetrics.byMonth.map((m) => m.month))] : [],
      datasets:
        serviciosMetrics?.byMonth
          .reduce((acc: any[], curr) => {
            if (!acc.find((d) => d.label === curr.service)) {
              acc.push({
                label: curr.service,
                data: serviciosMetrics.byMonth
                  .filter((m) => m.service === curr.service)
                  .map((m) => m.count),
                backgroundColor: chartColors.pieBackground[acc.length % chartColors.pieBackground.length],
                borderColor: chartColors.barBorder,
                borderWidth: 1,
              });
            }
            return acc;
          }, []) || [],
    },
    options: {
      ...chartOptions,
      plugins: { ...chartOptions.plugins, title: { ...chartOptions.plugins.title, text: 'Contrataciones por Mes' } },
    },
  };

  const serviciosPieChart = {
    type: 'pie' as const,
    data: {
      labels: serviciosMetrics?.byWeek ? [...new Set(serviciosMetrics.byWeek.map((m) => m.service))] : [],
      datasets: [
        {
          label: 'Contrataciones por Servicio',
          data: serviciosMetrics?.byWeek.reduce((acc: number[], curr) => {
            const index = serviciosMetrics.byWeek.findIndex((m) => m.service === curr.service);
            acc[index] = (acc[index] || 0) + curr.count;
            return acc;
          }, []) || [],
          backgroundColor: chartColors.pieBackground,
          borderColor: chartColors.pieBorder,
          borderWidth: 1,
        },
      ],
    },
    options: {
      ...chartOptions,
      plugins: { ...chartOptions.plugins, title: { ...chartOptions.plugins.title, text: 'Contrataciones por Servicio' } },
    },
  };

  // Inventario Charts
  const inventarioBarChart = {
    type: 'bar' as const,
    data: {
      labels: inventarioMetrics?.byMonth.map((m) => m.month) || [],
      datasets: [
        {
          label: 'Uso por Mes',
          data: inventarioMetrics?.byMonth.map((m) => m.count) || [],
          backgroundColor: chartColors.barBackground,
          borderColor: chartColors.barBorder,
          borderWidth: 1,
        },
      ],
    },
    options: {
      ...chartOptions,
      plugins: { ...chartOptions.plugins, title: { ...chartOptions.plugins.title, text: 'Uso por Mes' } },
    },
  };

  const inventarioPieChart = {
    type: 'pie' as const,
    data: {
      labels: inventarioMetrics?.byWeek.map((m) => m.week) || [],
      datasets: [
        {
          label: 'Uso por Semana',
          data: inventarioMetrics?.byWeek.map((m) => m.count) || [],
          backgroundColor: chartColors.pieBackground,
          borderColor: chartColors.pieBorder,
          borderWidth: 1,
        },
      ],
    },
    options: {
      ...chartOptions,
      plugins: { ...chartOptions.plugins, title: { ...chartOptions.plugins.title, text: 'Uso por Semana' } },
    },
  };

  // Usuario Charts
  const usuarioBarChart = {
    type: 'bar' as const,
    data: {
      labels: usuarioMetrics?.byService.map((m) => m.service) || [],
      datasets: [
        {
          label: 'Clientes por Servicio',
          data: usuarioMetrics?.byService.map((m) => m.count) || [],
          backgroundColor: chartColors.barBackground,
          borderColor: chartColors.barBorder,
          borderWidth: 1,
        },
      ],
    },
    options: {
      ...chartOptions,
      plugins: { ...chartOptions.plugins, title: { ...chartOptions.plugins.title, text: 'Clientes por Servicio' } },
    },
  };

  const usuarioPieChart = {
    type: 'pie' as const,
    data: {
      labels: usuarioMetrics?.byService.map((m) => m.service) || [],
      datasets: [
        {
          label: 'Distribución de Clientes',
          data: usuarioMetrics?.byService.map((m) => m.count) || [],
          backgroundColor: chartColors.pieBackground,
          borderColor: chartColors.pieBorder,
          borderWidth: 1,
        },
      ],
    },
    options: {
      ...chartOptions,
      plugins: { ...chartOptions.plugins, title: { ...chartOptions.plugins.title, text: 'Distribución de Clientes' } },
    },
  };

  if (loading) return <Typography>Cargando datos...</Typography>;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F2EFEA' }}>
      <Box sx={{ width: '250px', backgroundColor: '#6C4F4B', color: '#F2EFEA', p: 3, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" sx={{ fontFamily: `'Playfair Display', serif`, fontWeight: 700, mb: 4, textAlign: 'center' }}>
          Panel de Administración
        </Typography>
        <Box component="nav">
          {sidebarLinks.map((item, index) => (
            <Button
              key={index}
              component={NavLink}
              to={item.path}
              fullWidth
              sx={{
                color: '#F2EFEA',
                justifyContent: 'flex-start',
                mb: 1,
                borderRadius: '20px',
                textTransform: 'none',
                fontFamily: `'Roboto', sans-serif`,
                '&.active': { backgroundColor: '#A48E5F' },
                '&:hover': { backgroundColor: '#A48E5F' },
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>
      </Box>

      <Box sx={{ flex: 1, p: 4 }}>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                  <Typography variant="h4" sx={{ color: '#B59F6B', fontFamily: `'Playfair Display', serif`, fontWeight: 700 }}>
                    Dashboard{' '}
                    <Typography component="span" variant="h6" sx={{ color: '#6C4F4B', fontFamily: `'Roboto', sans-serif` }}>
                      Vista General
                    </Typography>
                  </Typography>
                  <Typography sx={{ color: '#6C4F4B', fontFamily: `'Roboto', sans-serif` }}>
                    2025 Aquelarre de Informáticos
                  </Typography>
                </Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3, mb: 4 }}>
                  <Box sx={{ backgroundColor: '#FFF', p: 3, borderRadius: 2, boxShadow: 1, textAlign: 'center' }}>
                    <Typography sx={{ color: '#6C4F4B', fontFamily: `'Roboto', sans-serif` }}>Servicios Activos</Typography>
                    <Typography variant="h5" sx={{ color: '#B59F6B', fontFamily: `'Playfair Display', serif`, fontWeight: 700 }}>
                      {metrics?.activeServices || '0'}
                    </Typography>
                  </Box>
                  <Box sx={{ backgroundColor: '#FFF', p: 3, borderRadius: 2, boxShadow: 1, textAlign: 'center' }}>
                    <Typography sx={{ color: '#6C4F4B', fontFamily: `'Roboto', sans-serif` }}>Velatorios Ocupados</Typography>
                    <Typography variant="h5" sx={{ color: '#B59F6B', fontFamily: `'Playfair Display', serif`, fontWeight: 700 }}>
                      {metrics?.occupiedFunerals || '0'}
                    </Typography>
                  </Box>
                  <Box sx={{ backgroundColor: '#FFF', p: 3, borderRadius: 2, boxShadow: 1, textAlign: 'center' }}>
                    <Typography sx={{ color: '#6C4F4B', fontFamily: `'Roboto', sans-serif` }}>Ingresos Totales</Typography>
                    <Typography variant="h5" sx={{ color: '#B59F6B', fontFamily: `'Playfair Display', serif`, fontWeight: 700 }}>
                      {metrics?.monthlyRevenue ? `${metrics.monthlyRevenue} Bs` : '0 Bs'}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3, mb: 4 }}>
                  <Box sx={{ backgroundColor: '#FFF', p: 3, borderRadius: 2, boxShadow: 1 }}>
                    <Typography variant="h6" sx={{ color: '#6C4F4B', fontFamily: `'Roboto', sans-serif`, mb: 2 }}>
                      Servicios por Mes
                    </Typography>
                    <Bar {...dashboardBarChart} />
                  </Box>
                  <Box sx={{ backgroundColor: '#FFF', p: 3, borderRadius: 2, boxShadow: 1 }}>
                    <Typography variant="h6" sx={{ color: '#6C4F4B', fontFamily: `'Roboto', sans-serif`, mb: 2 }}>
                      Ingresos por Mes
                    </Typography>
                    <Pie {...dashboardRevenuePieChart} />
                  </Box>
                  <Box sx={{ backgroundColor: '#FFF', p: 3, borderRadius: 2, boxShadow: 1 }}>
                    <Typography variant="h6" sx={{ color: '#6C4F4B', fontFamily: `'Roboto', sans-serif`, mb: 2 }}>
                      Obituarios Publicados
                    </Typography>
                    <Pie {...dashboardObituariesPieChart} />
                  </Box>
                </Box>
              </>
            }
          />
          <Route
            path="velatorios"
            element={
              <>
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h4" sx={{ color: '#B59F6B', fontFamily: `'Playfair Display', serif`, fontWeight: 700 }}>
                    Velatorios{' '}
                    <Typography component="span" variant="h6" sx={{ color: '#6C4F4B', fontFamily: `'Roboto', sans-serif` }}>
                      Reservas
                    </Typography>
                  </Typography>
                </Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3, mb: 4 }}>
                  <Box sx={{ backgroundColor: '#FFF', p: 3, borderRadius: 2, boxShadow: 1 }}>
                    <Typography variant="h6" sx={{ color: '#6C4F4B', fontFamily: `'Roboto', sans-serif`, mb: 2 }}>
                      Reservas por Mes
                    </Typography>
                    <Bar {...velatoriosBarChart} />
                  </Box>
                  <Box sx={{ backgroundColor: '#FFF', p: 3, borderRadius: 2, boxShadow: 1 }}>
                    <Typography variant="h6" sx={{ color: '#6C4F4B', fontFamily: `'Roboto', sans-serif`, mb: 2 }}>
                      Reservas por Día
                    </Typography>
                    <Pie {...velatoriosPieChart} />
                  </Box>
                </Box>
              </>
            }
          />
          <Route
            path="inventario"
            element={
              <>
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h4" sx={{ color: '#B59F6B', fontFamily: `'Playfair Display', serif`, fontWeight: 700 }}>
                    Inventario{' '}
                    <Typography component="span" variant="h6" sx={{ color: '#6C4F4B', fontFamily: `'Roboto', sans-serif` }}>
                      Uso de Recursos
                    </Typography>
                  </Typography>
                </Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3, mb: 4 }}>
                  <Box sx={{ backgroundColor: '#FFF', p: 3, borderRadius: 2, boxShadow: 1 }}>
                    <Typography variant="h6" sx={{ color: '#6C4F4B', fontFamily: `'Roboto', sans-serif`, mb: 2 }}>
                      Uso por Mes
                    </Typography>
                    <Bar {...inventarioBarChart} />
                  </Box>
                  <Box sx={{ backgroundColor: '#FFF', p: 3, borderRadius: 2, boxShadow: 1 }}>
                    <Typography variant="h6" sx={{ color: '#6C4F4B', fontFamily: `'Roboto', sans-serif`, mb: 2 }}>
                      Uso por Semana
                    </Typography>
                    <Pie {...inventarioPieChart} />
                  </Box>
                </Box>
              </>
            }
          />
          <Route
            path="servicios"
            element={
              <>
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h4" sx={{ color: '#B59F6B', fontFamily: `'Playfair Display', serif`, fontWeight: 700 }}>
                    Servicios{' '}
                    <Typography component="span" variant="h6" sx={{ color: '#6C4F4B', fontFamily: `'Roboto', sans-serif` }}>
                      Contrataciones
                    </Typography>
                  </Typography>
                </Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3, mb: 4 }}>
                  <Box sx={{ backgroundColor: '#FFF', p: 3, borderRadius: 2, boxShadow: 1 }}>
                    <Typography variant="h6" sx={{ color: '#6C4F4B', fontFamily: `'Roboto', sans-serif`, mb: 2 }}>
                      Contrataciones por Mes
                    </Typography>
                    <Bar {...serviciosBarChart} />
                  </Box>
                  <Box sx={{ backgroundColor: '#FFF', p: 3, borderRadius: 2, boxShadow: 1 }}>
                    <Typography variant="h6" sx={{ color: '#6C4F4B', fontFamily: `'Roboto', sans-serif`, mb: 2 }}>
                      Contrataciones por Servicio
                    </Typography>
                    <Pie {...serviciosPieChart} />
                  </Box>
                </Box>
              </>
            }
          />
          <Route
            path="usuario"
            element={
              <>
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h4" sx={{ color: '#B59F6B', fontFamily: `'Playfair Display', serif`, fontWeight: 700 }}>
                    Usuarios{' '}
                    <Typography component="span" variant="h6" sx={{ color: '#6C4F4B', fontFamily: `'Roboto', sans-serif` }}>
                      Uso de Servicios
                    </Typography>
                  </Typography>
                </Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3, mb: 4 }}>
                  <Box sx={{ backgroundColor: '#FFF', p: 3, borderRadius: 2, boxShadow: 1 }}>
                    <Typography variant="h6" sx={{ color: '#6C4F4B', fontFamily: `'Roboto', sans-serif`, mb: 2 }}>
                      Clientes por Servicio
                    </Typography>
                    <Bar {...usuarioBarChart} />
                  </Box>
                  <Box sx={{ backgroundColor: '#FFF', p: 3, borderRadius: 2, boxShadow: 1 }}>
                    <Typography variant="h6" sx={{ color: '#6C4F4B', fontFamily: `'Roboto', sans-serif`, mb: 2 }}>
                      Distribución de Clientes
                    </Typography>
                    <Pie {...usuarioPieChart} />
                  </Box>
                </Box>
              </>
            }
          />
          <Route path="reportes" element={<Reportes />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default Dashboard;