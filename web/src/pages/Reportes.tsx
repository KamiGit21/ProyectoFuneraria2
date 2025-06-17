import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, TextField } from '@mui/material';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { getReportesMetrics, ReportesMetrics } from '../api/dashboard';
import { getOrderReports } from '../api/orders';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface ClientServiceDetail {
  clientName: string;
  serviceName: string;
  orderDate: string;
  quantity: number;
  subtotal: number;
}

const Reportes: React.FC = () => {
  const [metrics, setMetrics] = useState<ReportesMetrics | null>(null);
  const [clientDetails, setClientDetails] = useState<ClientServiceDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clientFilter, setClientFilter] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [metricsData, clientData] = await Promise.all([
          getReportesMetrics(),
          getOrderReports(),
        ]);
        setMetrics(metricsData);
        setClientDetails(clientData);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const generatePDF = () => {
    if (!metrics?.services.length && !clientDetails.length) return;

    const doc = new jsPDF();
    let finalY = 0; // Controla la posición vertical

    // 1. Logo de la empresa en Base64
    const logoBase64 = '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';

    // 2. Añadir el logo al documento
    doc.addImage(logoBase64, 'JPEG', 15, 8, 30, 30); // (logo, formato, x, y, ancho, alto)

    // 3. Título principal centrado y en negrita
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    const title = 'Reporte de Servicios - 2025';
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.text(title, pageWidth / 2, 25, { align: 'center' });
    
    // Y-position inicial después del encabezado
    let startY = 50;

    // --- Tabla de Resumen de Servicios ---
    if (metrics?.services.length) {
      // Título de la sección en negrita
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Resumen de Servicios', 14, startY);

      const headServices = [['Servicio', 'Contrataciones', 'Ingresos']];
      const bodyServices = metrics.services.map(service => [
        service.name,
        service.count,
        `${service.revenue.toFixed(2)} Bs`
      ]);

      doc.autoTable({
        startY: startY + 5,
        head: headServices,
        body: bodyServices,
        theme: 'striped',
        headStyles: {
          fillColor: [108, 79, 75],
          textColor: [255, 255, 255],
          halign: 'center',
        },
        didDrawPage: (data: any) => {
          finalY = data.cursor?.y ?? 0;
        }
      });
    }

    // --- Tabla de Detalles por Cliente ---
    const filteredDetails = clientDetails.filter((detail) =>
      detail.clientName.toLowerCase().includes(clientFilter.toLowerCase())
    );

    if (filteredDetails.length) {
      const detailsStartY = (finalY || startY) + 15;
      
      // Título de la sección en negrita
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Detalles por Cliente', 14, detailsStartY);

      const headDetails = [['Cliente', 'Servicio', 'Fecha', 'Cantidad', 'Subtotal']];
      const bodyDetails = filteredDetails.map(detail => [
        detail.clientName,
        detail.serviceName,
        detail.orderDate,
        detail.quantity,
        `${detail.subtotal.toFixed(2)} Bs`
      ]);

      doc.autoTable({
        startY: detailsStartY + 5,
        head: headDetails,
        body: bodyDetails,
        theme: 'grid',
        headStyles: {
          fillColor: [181, 159, 107],
          textColor: [255, 255, 255],
          halign: 'center',
        },
      });
    }

    doc.save('reporte_servicios_2025.pdf');
  };

  if (loading) return <Typography>Cargando datos...</Typography>;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  const filteredDetails = clientDetails.filter((detail) =>
    detail.clientName.toLowerCase().includes(clientFilter.toLowerCase())
  );

  return (
    <Box sx={{ p: 4, backgroundColor: '#F2EFEA', minHeight: '100vh' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ color: '#B59F6B', fontFamily: `'Playfair Display', serif`, fontWeight: 700 }}>
          Reportes{' '}
          <Typography component="span" variant="h6" sx={{ color: '#6C4F4B', fontFamily: `'Roboto', sans-serif` }}>
            Servicios Adquiridos
          </Typography>
        </Typography>
      </Box>

      {/* El resto de la UI no necesita cambios */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ color: '#6C4F4B', fontFamily: `'Roboto', sans-serif`, mb: 2 }}>
          Resumen de Servicios - 2025
        </Typography>
        {metrics?.services.map((service, index) => (
          <Box
            key={index}
            sx={{ backgroundColor: '#FFF', p: 2, borderRadius: 2, boxShadow: 1, mb: 1, display: 'flex', justifyContent: 'space-between' }}
          >
            <Typography sx={{ color: '#6C4F4B' }}>{service.name}</Typography>
            <Typography sx={{ color: '#6C4F4B' }}>Contrataciones: {service.count}</Typography>
            <Typography sx={{ color: '#6C4F4B' }}>Ingresos: {service.revenue} Bs</Typography>
          </Box>
        ))}
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ color: '#6C4F4B', fontFamily: `'Roboto', sans-serif`, mb: 2 }}>
          Detalles por Cliente
        </Typography>
        <TextField
          label="Filtrar por Cliente"
          value={clientFilter}
          onChange={(e) => setClientFilter(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        {filteredDetails.map((detail, index) => (
          <Box
            key={index}
            sx={{ backgroundColor: '#FFF', p: 2, borderRadius: 2, boxShadow: 1, mb: 1, display: 'flex', justifyContent: 'space-between' }}
          >
            <Typography sx={{ color: '#6C4F4B' }}>{detail.clientName}</Typography>
            <Typography sx={{ color: '#6C4F4B' }}>{detail.serviceName}</Typography>
            <Typography sx={{ color: '#6C4F4B' }}>{detail.orderDate}</Typography>
            <Typography sx={{ color: '#6C4F4B' }}>Cantidad: {detail.quantity}</Typography>
            <Typography sx={{ color: '#6C4F4B' }}>{detail.subtotal} Bs</Typography>
          </Box>
        ))}
      </Box>
      
      <Box sx={{ textAlign: 'center' }}>
        <Button
          variant="contained"
          onClick={generatePDF}
          disabled={!metrics?.services.length && !clientDetails.length}
          sx={{ backgroundColor: '#B59F6B', color: '#FFF', '&:hover': { backgroundColor: '#A48E5F' } }}
        >
          Generar Reporte PDF
        </Button>
      </Box>
    </Box>
  );
};

export default Reportes;
