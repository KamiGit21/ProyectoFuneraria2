import React, { useState } from 'react';
import {
  Box, Typography, Stepper, Step, StepLabel, Button,
  Table, TableBody, TableCell, TableHead, TableRow, TextField
} from '@mui/material';
import { useCart }   from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';

export default function Checkout() {
  const { items, total, removeItem, clear } = useCart();
  const [step, setStep]   = useState(0);
  const [difunto, setDifunto] = useState('');
  const [fecha,   setFecha]   = useState('');
  const nav = useNavigate();

  const next = () => setStep(s => s + 1);
  const back = () => setStep(s => s - 1);

  const finish = async () => {
    const body = {
      difunto: { nombres: difunto, fecha_fallecido: fecha },
      lineas : items.map(i => ({
        servicioId: i.servicio.id,
        cantidad  : i.cantidad,
      })),
    };
    const { data } = await api.post('/ordenes', body);
    clear();
    nav(`/ordenes/seguimiento/${data.id}`);
  };

  /* util precio seguro */
  const priceNum = (p: number | string) => Number(p) || 0;

  return (
    <Box sx={{ mt: 4, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h1" gutterBottom>Checkout</Typography>

      <Stepper activeStep={step} sx={{ mb: 4 }}>
        {['Detalles', 'Revisión', 'Pago'].map(l => (
          <Step key={l}><StepLabel>{l}</StepLabel></Step>
        ))}
      </Stepper>

      {/* Paso 1 */}
      {step === 0 && (
        <>
          <TextField
            label="Nombre del difunto" fullWidth sx={{ mb: 2 }}
            value={difunto} onChange={e => setDifunto(e.target.value)}
          />
          <TextField
            label="Fecha de fallecimiento" type="date" fullWidth sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
            value={fecha} onChange={e => setFecha(e.target.value)}
          />
          <Button variant="contained" disabled={!difunto || !fecha} onClick={next}>
            Siguiente
          </Button>
        </>
      )}

      {/* Paso 2 */}
      {step === 1 && (
        <>
          <Table sx={{ mb: 3 }}>
            <TableHead>
              <TableRow>
                <TableCell>Servicio</TableCell>
                <TableCell>Cant.</TableCell>
                <TableCell align="right">Subtotal (Bs)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map(i => {
                const price   = priceNum(i.servicio.precio_base);
                const cant    = i.cantidad ?? 0;
                const subTot  = (price * cant).toFixed(2);

                return (
                  <TableRow key={i.servicio.id}>
                    <TableCell>{i.servicio.nombre}</TableCell>
                    <TableCell>{cant}</TableCell>
                    <TableCell align="right">{subTot}</TableCell>
                    <TableCell>
                      <Button size="small" onClick={() => removeItem(i.servicio.id)}>
                        Quitar
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}

              <TableRow>
                <TableCell colSpan={2}><strong>Total</strong></TableCell>
                <TableCell align="right"><strong>{total().toFixed(2)}</strong></TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Button onClick={back} sx={{ mr: 2 }}>Atrás</Button>
          <Button variant="contained" disabled={!items.length} onClick={next}>
            Continuar&nbsp;&gt;
          </Button>
        </>
      )}

      {/* Paso 3 */}
      {step === 2 && (
        <>
          <Typography variant="h5" sx={{ mb: 3 }}>Pago (mock)</Typography>
          <Button onClick={back} sx={{ mr: 2 }}>Atrás</Button>
          <Button variant="contained" disabled={!items.length} onClick={finish}>
            Finalizar compra
          </Button>
        </>
      )}
    </Box>
  );
}
