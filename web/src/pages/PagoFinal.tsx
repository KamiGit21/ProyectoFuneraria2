// web/src/pages/PagoFinal.tsx

import React, { useEffect, useState, useContext } from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  TextField,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Divider,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import { AuthContext } from '../contexts/AuthContext';

/* Estilos específicos de esta pantalla */
import '../styles/pagoFinal.css';

interface ServicioResumen {
  id: number;
  nombre: string;
  precio_base: number;
  cantidad: number;
  subtotal: number;
  imagenUrl: string | null;
}

interface DetalleOrden {
  id: number | string;
  estado: string;
  total: number;
  cliente: { id: number | string; nombres: string; email: string };
  servicios: ServicioResumen[];
}

const METODOS = ['Tarjeta', 'Transferencia', 'Efectivo', 'Billetera'] as const;
type MetodoTipo = (typeof METODOS)[number];

export default function PagoFinal() {
  const { id } = useParams<{ id: string }>();
  const orderId = Number(id);
  const nav = useNavigate();
  const authCtx = useContext(AuthContext);

  const [detalle, setDetalle] = useState<DetalleOrden | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [procesandoPago, setProcesandoPago] = useState(false);
  const [mensajePago, setMensajePago] = useState<string | null>(null);

  // cuál método de pago está seleccionado
  const [metodo, setMetodo] = useState<MetodoTipo>('Tarjeta');

  // --- Campos para “Tarjeta” ---
  const [cardNumber, setCardNumber] = useState('');      // solo dígitos
  const [expiry, setExpiry] = useState('');             // formato MM/AA
  const [cvc, setCvc] = useState('');                   // 3 dígitos
  const [cardHolder, setCardHolder] = useState('');
  // Errores específicos por campo
  const [errorCardNumber, setErrorCardNumber] = useState<string | null>(null);
  const [errorExpiry, setErrorExpiry] = useState<string | null>(null);
  const [errorCvc, setErrorCvc] = useState<string | null>(null);
  const [errorCardHolder, setErrorCardHolder] = useState<string | null>(null);

  // Detectar tipo de tarjeta (Visa/MC) según el primer dígito
  const detectCardType = (num: string) => {
    if (num.startsWith('4')) return 'Visa';
    if (num.startsWith('5')) return 'MasterCard';
    return '';
  };

  /* ---------- cargar detalle de la orden ---------- */
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const resp = await api.get<DetalleOrden>(`/ordenes/${orderId}`);
        setDetalle(resp.data);
      } catch (err: any) {
        console.error(err);
        setError(err.response?.data?.error ?? 'No se pudo cargar la orden.');
      } finally {
        setLoading(false);
      }
    })();
  }, [orderId]);

  /* ---------- permisos: sólo el cliente que creó la orden y estado CONFIRMADO ---------- */
  const userRole = (authCtx?.user?.rol ?? '').toString().toUpperCase().trim();
  const userId = authCtx?.user?.id ? Number(authCtx.user.id) : null;

  const userEsCliente =
    userRole === 'CLIENTE' &&
    userId !== null &&
    detalle &&
    String(detalle.cliente.id) === String(userId);

  const puedePagar = userEsCliente && detalle?.estado === 'CONFIRMADO';

  /* ---------- Validaciones del formulario de tarjeta ---------- */
  const validarCardNumber = (num: string) => {
    const onlyDigits = num.replace(/\D/g, '');
    if (onlyDigits.length !== 16) {
      setErrorCardNumber('El número debe tener 16 dígitos.');
      return false;
    }
    const type = detectCardType(onlyDigits);
    if (type !== 'Visa' && type !== 'MasterCard') {
      setErrorCardNumber('Solo Visa o MasterCard válidas.');
      return false;
    }
    setErrorCardNumber(null);
    return true;
  };

  const validarExpiry = (exp: string) => {
    // Formato MM/AA, mes entre 01 y 12, año >= actual (asumimos 00-99)
    const match = exp.match(/^(\d{2})\/(\d{2})$/);
    if (!match) {
      setErrorExpiry('Formato MM/AA requerido.');
      return false;
    }
    const mes = Number(match[1]);
    const año = Number(match[2]) + 2000;
    if (mes < 1 || mes > 12) {
      setErrorExpiry('Mes inválido (01-12).');
      return false;
    }
    const ahora = new Date();
    const añoActual = ahora.getFullYear();
    const mesActual = ahora.getMonth() + 1;
    if (año < añoActual || (año === añoActual && mes < mesActual)) {
      setErrorExpiry('Fecha de expiración vencida.');
      return false;
    }
    setErrorExpiry(null);
    return true;
  };

  const validarCvc = (cv: string) => {
    const onlyDigits = cv.replace(/\D/g, '');
    if (onlyDigits.length !== 3) {
      setErrorCvc('CVC debe tener 3 dígitos.');
      return false;
    }
    setErrorCvc(null);
    return true;
  };

  const validarCardHolder = (name: string) => {
    if (name.trim().length < 3) {
      setErrorCardHolder('Nombre inválido.');
      return false;
    }
    setErrorCardHolder(null);
    return true;
  };

  // Determina si el formulario de tarjeta es válido:
  const tarjetaValida = () => {
    return (
      cardNumber.length === 16 &&
      !errorCardNumber &&
      expiry.length === 5 &&
      !errorExpiry &&
      cvc.length === 3 &&
      !errorCvc &&
      cardHolder.trim().length >= 3 &&
      !errorCardHolder
    );
  };

  /* ---------- handle: procesar pago (mock) ---------- */
  const handleProcesarPago = async () => {
    if (!detalle) return;
    setProcesandoPago(true);
    setMensajePago(null);

    try {
      // Llamamos al endpoint mock en backend, pasando el método elegido
      await api.post(`/ordenes/${orderId}/pagar`, {
        metodo,
      });
      setMensajePago('Pago registrado con éxito.');
      setTimeout(() => {
        nav('/ordenes');
      }, 1500);
    } catch (err: any) {
      console.error(err);
      setMensajePago(err.response?.data?.error ?? 'Error al procesar el pago.');
    } finally {
      setProcesandoPago(false);
    }
  };

  /* ---------- UI de carga / error ---------- */
  if (loading) {
    return (
      <Box className="pago-final__loading">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="pago-final__alert">
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!detalle || !puedePagar) {
    return (
      <Box className="pago-final__alert">
        <Alert severity="warning">
          No tienes permisos para realizar el pago de esta orden.
        </Alert>
      </Box>
    );
  }

  /* ---------- componente principal ---------- */
  return (
    <Box className="pago-final">
      <Typography variant="h4">Pago de Orden #{detalle.id}</Typography>
      <Typography className="sub">
        Cliente: {detalle.cliente.nombres} ({detalle.cliente.email})
      </Typography>
      <Typography sx={{ mb: 3 }}>
        Total a pagar: <strong>{detalle.total.toFixed(2)} Bs</strong>
      </Typography>

      {/* 
        Contenedor principal con dos columnas:
        - Columna izquierda: métodos de pago + formulario de “Tarjeta”
        - Columna derecha: mini resumen de servicios 
      */}
      <Box className="pago-columns">
        {/* ------------------ IZQUIERDA: métodos / formulario ------------------ */}
        <Box className="pago-col-left">
          {/* Lista de métodos de pago (Tarjeta / Transferencia / Efectivo / Billetera) */}
          <ul className="metodo-list">
            {METODOS.map((m) => (
              <React.Fragment key={m}>
                <li
                  className={`metodo-item ${metodo === m ? 'active' : ''}`}
                  onClick={() => {
                    if (procesandoPago) return;
                    setMetodo(m);
                    setMensajePago(null);
                  }}
                >
                  <span className="icon" />
                  <div>
                    <span className="label">{m}</span>
                  </div>
                </li>

                {/* 
                  Justo debajo de la tarjeta, y sólo si está seleccionada Tarjeta, 
                  desplegamos el formulario. 
                */}
                {m === 'Tarjeta' && metodo === 'Tarjeta' && (
                  <Box className="tarjeta-form" sx={{ mb: 3 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Número de tarjeta"
                          variant="outlined"
                          value={cardNumber}
                          onChange={(e) => {
                            const soloDig = e.target.value
                              .replace(/\D/g, '')
                              .slice(0, 16);
                            setCardNumber(soloDig);
                            if (errorCardNumber && soloDig.length === 16) {
                              validarCardNumber(soloDig);
                            }
                          }}
                          onBlur={() => validarCardNumber(cardNumber)}
                          helperText={errorCardNumber || detectCardType(cardNumber)}
                          error={!!errorCardNumber}
                          inputProps={{ maxLength: 16 }}
                          placeholder="Ej: 4123 4567 8901 2345"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label="MM/AA"
                          variant="outlined"
                          value={expiry}
                          onChange={(e) => {
                            let val = e.target.value.replace(/\D/g, '').slice(0, 4);
                            if (val.length >= 3) {
                              val = `${val.slice(0, 2)}/${val.slice(2)}`;
                            }
                            setExpiry(val);
                            if (errorExpiry && val.length === 5) {
                              validarExpiry(val);
                            }
                          }}
                          onBlur={() => validarExpiry(expiry)}
                          helperText={errorExpiry || ''}
                          error={!!errorExpiry}
                          placeholder="MM/AA"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label="CVC"
                          variant="outlined"
                          value={cvc}
                          onChange={(e) => {
                            const soloDig = e.target.value.replace(/\D/g, '').slice(0, 3);
                            setCvc(soloDig);
                            if (errorCvc && soloDig.length === 3) {
                              validarCvc(soloDig);
                            }
                          }}
                          onBlur={() => validarCvc(cvc)}
                          helperText={errorCvc || ''}
                          error={!!errorCvc}
                          placeholder="Ej: 123"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Titular de la tarjeta"
                          variant="outlined"
                          value={cardHolder}
                          onChange={(e) => {
                            setCardHolder(e.target.value);
                            if (errorCardHolder && e.target.value.trim().length >= 3) {
                              validarCardHolder(e.target.value);
                            }
                          }}
                          onBlur={() => validarCardHolder(cardHolder)}
                          helperText={errorCardHolder || ''}
                          error={!!errorCardHolder}
                          placeholder="Nombre tal como aparece en la tarjeta"
                        />
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </React.Fragment>
            ))}
          </ul>

          {/* Botón “Confirmar Pago” para cualquiera de los métodos */}
          <Box className="pago-actions" sx={{ mb: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleProcesarPago}
              disabled={
                procesandoPago ||
                (metodo === 'Tarjeta' && !tarjetaValida())
              }
            >
              {procesandoPago ? 'Procesando…' : 'Confirmar Pago'}
            </Button>
            <Button onClick={() => nav('/ordenes')} disabled={procesandoPago}>
              Volver a mis órdenes
            </Button>
          </Box>

          {/* Mensaje de resultado (éxito o error) */}
          {mensajePago && (
            <Alert
              severity={mensajePago.includes('éxito') ? 'success' : 'error'}
              sx={{ mt: 1 }}
            >
              {mensajePago}
            </Alert>
          )}
        </Box>

        {/* ------------------ DERECHA: resumen de servicios ------------------ */}
        <Box className="pago-col-right">
          <Typography variant="h6" sx={{ mb: 1 }}>
            Resumen de tu compra
          </Typography>
          <Divider sx={{ mb: 1 }} />

          {detalle.servicios.map((srv) => (
            <Card key={srv.id} className="resumen-card" elevation={0}>
              {srv.imagenUrl && (
                <CardMedia
                  component="img"
                  image={srv.imagenUrl}
                  alt={srv.nombre}
                  className="resumen-img"
                />
              )}
              <CardContent className="resumen-info">
                <Typography className="resumen-nombre">
                  {srv.nombre}
                </Typography>
                <Typography className="resumen-subtotal">
                  {srv.cantidad} × {srv.precio_base.toFixed(2)} Bs ={' '}
                  <strong>{srv.subtotal.toFixed(2)} Bs</strong>
                </Typography>
              </CardContent>
            </Card>
          ))}

          <Divider sx={{ my: 1 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Total: {detalle.total.toFixed(2)} Bs
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
