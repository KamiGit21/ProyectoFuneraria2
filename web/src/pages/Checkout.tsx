// src/pages/Checkout.tsx

import React, { useState, useContext, useEffect } from "react";
import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  Grid,
  CircularProgress,
} from "@mui/material";
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useCart } from "../contexts/CartContext";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import { AuthContext } from "../contexts/AuthContext";

// Importamos Lottie y la animación JSON
import Lottie from "lottie-react";
import animationData from "../assets/orderReview.json";

// Importamos los estilos CSS específicos para este componente
import "../styles/checkout.css";

export default function Checkout() {
  const { items, total, clear, updateItem, removeItem } = useCart();
  const [step, setStep] = useState(0);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const authCtx = useContext(AuthContext);

  // Convertir clienteId a number (si authCtx.user.id viene como string)
  const clienteIdRaw = authCtx?.user?.id;
  const clienteId = clienteIdRaw ? Number(clienteIdRaw) : null;

  // Estados para datos del difunto
  const [nombres, setNombres] = useState("");
  const [fechaFallecido, setFechaFallecido] = useState("");
  const [lugarFallecimiento, setLugarFallecimiento] = useState("");
  const [contactoResponsable, setContactoResponsable] = useState("");
  const [relacionSolicitante, setRelacionSolicitante] = useState("");
  const [notas, setNotas] = useState("");

  const priceNum = (p: number | string) => Number(p) || 0;

  // ─── STEP 0: Avanzar al formulario de difunto ────────────────────────────────
  const handleNextToDifunto = () => {
    if (!items.length) return;
    setStep(1);
  };

  // ─── STEP 1: Enviar datos del difunto + crear orden múltiple ─────────────────
  const handleSubmitDifunto = async () => {
    // Validaciones básicas
    if (!items.length) return;
    if (clienteId === null || isNaN(clienteId)) {
      alert("No se detectó el cliente (sesión inválida).");
      return;
    }
    if (!nombres.trim() || !fechaFallecido) {
      alert('Los campos "Nombres" y "Fecha de fallecimiento" son obligatorios.');
      return;
    }

    setLoading(true);
    try {
      // 1) Construir array "lineas" a partir del carrito
      //    Cada línea del carrito -> { servicioId, cantidad }
      const lineasPayload = items.map((i) => {
        const rawId = i.servicio.id;
        const servicioId = typeof rawId === "string" ? Number(rawId) : rawId;
        return {
          servicioId: servicioId,
          cantidad:   i.cantidad ?? 1,
        };
      });

      // 2) Calcular total directamente desde el contexto
      const totalOrden = total();

      // 3) Crear el body completo que coincide con OrderCreateDto
      const body = {
        clienteId:    clienteId,
        tipoServicio: "ENTIERRO",    // ← puedes cambiar este valor si tu app permite otro tipo
        total:        totalOrden,
        lineas:       lineasPayload,
        difunto: {
          nombres:             nombres.trim(),
          fecha_fallecido:     fechaFallecido,
          lugar_fallecimiento: lugarFallecimiento || undefined,
          contacto_responsable: contactoResponsable || undefined,
          relacion_solicitante: relacionSolicitante || undefined,
          notas:               notas || undefined,
        },
      };

      console.log("🌐 Payload enviado a /api/ordenes:", body);
      // 4) Hacemos POST a "/api/ordenes" (múltiples líneas)
      const { data } = await api.post("/ordenes", body);

      setOrderId(data.id);
      setStep(2);
    } catch (err: any) {
      console.error("Error al crear la orden múltiple (AxiosError):", err);
      if (err.response?.data) {
        console.log("📋 Detalle del error:", err.response.data);
      }
      alert("No se pudo crear la orden. Revisa la consola para más detalles.");
    } finally {
      setLoading(false);
    }
  };

  // ─── STEP 2: Mostramos animación y luego redirigimos ─────────────────────────
  const handleFinish = () => {
    if (!orderId) return;
    clear();
    nav(`/ordenes/seguimiento/${orderId}`);
  };

  // Al llegar a STEP 2: reproducir animación y, tras 3s, redirigir
  useEffect(() => {
    if (step === 2) {
      const timeoutId = setTimeout(() => {
        handleFinish();
      }, 3000);
      return () => clearTimeout(timeoutId);
    }
  }, [step]);

  const handleBack = () => setStep((s) => s - 1);

  return (
    <Box sx={{ mt: 4, maxWidth: 800, mx: "auto" }}>
      <Typography variant="h1" gutterBottom>
        Resumen del pedido
      </Typography>

      <Stepper activeStep={step} sx={{ mb: 4 }}>
        {["Resumen", "Datos del difunto", "Revisando pedido"].map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* STEP 0: Vista del carrito */}
      {step === 0 && (
        <>
          {items.length ? (
            <>
              <Table sx={{ mb: 3 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Imagen</TableCell>
                    <TableCell>Servicio</TableCell>
                    <TableCell>Cantidad</TableCell>
                    <TableCell align="right">Subtotal (Bs)</TableCell>
                    <TableCell align="center">Eliminar</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((i) => {
                    const precio = priceNum(i.servicio.precio_base);
                    const cant = i.cantidad ?? 0;
                    const subTot = (precio * cant).toFixed(2);

                    const incrementar = () => updateItem(i.servicio.id, cant + 1);
                    const decrementar = () => {
                      if (cant > 1) updateItem(i.servicio.id, cant - 1);
                      else removeItem(i.servicio.id);
                    };

                    return (
                      <TableRow key={i.servicio.id}>
                        <TableCell>
                          {i.servicio.imagenUrl && (
                            <Box
                              component="img"
                              src={i.servicio.imagenUrl}
                              alt={i.servicio.nombre}
                              sx={{
                                width: 50,
                                height: 50,
                                objectFit: "cover",
                                borderRadius: 1,
                              }}
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          <Typography>{i.servicio.nombre}</Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <IconButton size="small" onClick={decrementar}>
                              <RemoveIcon fontSize="small" />
                            </IconButton>
                            <Typography sx={{ mx: 1 }}>{cant}</Typography>
                            <IconButton size="small" onClick={incrementar}>
                              <AddIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </TableCell>
                        <TableCell align="right">{subTot}</TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            onClick={() => removeItem(i.servicio.id)}
                            sx={{ color: "error.main" }}
                            aria-label="Eliminar servicio"
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  <TableRow>
                    <TableCell colSpan={3}>
                      <strong>Total</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>{total().toFixed(2)}</strong>
                    </TableCell>
                    <TableCell />
                  </TableRow>
                </TableBody>
              </Table>

              <Button
                variant="contained"
                disabled={!items.length}
                onClick={handleNextToDifunto}
              >
                Continuar
              </Button>
            </>
          ) : (
            <Typography>No hay servicios en el carrito.</Typography>
          )}
        </>
      )}

      {/* STEP 1: Formulario de difunto */}
      {step === 1 && (
        <Box component="form" noValidate autoComplete="off">
          <Typography variant="h5" sx={{ mb: 3 }}>
            Datos del difunto
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Nombres completos"
                value={nombres}
                onChange={(e) => setNombres(e.target.value)}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Fecha de fallecimiento"
                type="date"
                value={fechaFallecido}
                onChange={(e) => setFechaFallecido(e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Lugar de fallecimiento"
                value={lugarFallecimiento}
                onChange={(e) => setLugarFallecimiento(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Contacto responsable"
                value={contactoResponsable}
                onChange={(e) => setContactoResponsable(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Relación solicitante"
                value={relacionSolicitante}
                onChange={(e) => setRelacionSolicitante(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Notas adicionales"
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                fullWidth
                multiline
                rows={3}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3 }}>
            <Button onClick={handleBack} sx={{ mr: 2 }} disabled={loading}>
              Atrás
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmitDifunto}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={16} /> : null}
            >
              {loading ? "Creando orden..." : "Siguiente"}
            </Button>
          </Box>
        </Box>
      )}

      {/* STEP 2: Animación de “Revisando pedido…” */}
      {step === 2 && (
        <Box className="checkout-animation-container">
          <Lottie
            animationData={animationData}
            loop={false}
            className="checkout-lottie"
          />
          <Typography variant="h6" className="checkout-anim-text">
            Revisando tu pedido…
          </Typography>
        </Box>
      )}
    </Box>
  );
}
