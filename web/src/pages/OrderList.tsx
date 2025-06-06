// web/src/pages/OrderList.tsx

import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  MenuItem,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import { AuthContext } from "../contexts/AuthContext";

import "../styles/orderList.css";
import "../styles/orderDetail.css";

interface OrdenResumen {
  id: number;
  fecha_creacion: string; // ISO string
  estado: string; //  "PENDIENTE" | "CONFIRMADO" | "RECHAZO" | "DEVOLUCION" | "PAGADO"
}

interface DetalleOrden {
  id: number;
  fecha_creacion: string; 
  estado: string;
  servicios: Array<{
    id: number;
    nombre: string;
    precio_base: number;
    cantidad: number;
    subtotal: number;
    imagenUrl?: string | null;
  }>;
  cliente: {
    id: number;
    nombres: string;
    email: string;
  };
  difunto: {
    nombres: string;
    fecha_fallecido: string; 
    lugar_fallecimiento?: string | null;
    contacto_responsable?: string | null;
    relacion_solicitante?: string | null;
    notas_adicionales?: string | null;
  };
  total: number;
  notas_internas?: string;
}

export default function OrderList() {
  const [loading, setLoading] = useState<boolean>(true);
  const [ordenes, setOrdenes] = useState<OrdenResumen[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Para editar estado directamente en la tabla (OPERADOR/ADMIN)
  const [estadoUpdates, setEstadoUpdates] = useState<Record<number, string>>({});

  // Modal para ver detalle
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [detalle, setDetalle] = useState<DetalleOrden | null>(null);
  const [loadingDetail, setLoadingDetail] = useState<boolean>(false);
  const [errorDetail, setErrorDetail] = useState<string | null>(null);

  // Campos editables (OPERADOR/ADMIN) en el modal
  const [estadoEdit, setEstadoEdit] = useState<string>("");
  const [notasInternasEdit, setNotasInternasEdit] = useState<string>("");

  const nav = useNavigate();
  const authCtx = useContext(AuthContext);

  // Leer y normalizar el rol
  const rawRole = authCtx?.user?.rol ?? "";
  const userRole = rawRole.toString().toUpperCase().trim();

  const userIdRaw = authCtx?.user?.id;
  const userId = userIdRaw ? Number(userIdRaw) : null;

  // Solo estos cinco valores ahora incluyen "PAGADO"
  const estadosDisponibles = ["PENDIENTE", "CONFIRMADO", "RECHAZO", "DEVOLUCION", "PAGADO"];

  // ─── 1) Fetch inicial de órdenes ─────────────────────────────────────────────
  useEffect(() => {
    const fetchOrdenes = async () => {
      setLoading(true);
      setError(null);

      try {
        let data: OrdenResumen[] = [];
        if (userRole === "CLIENTE") {
          const resp = await api.get<OrdenResumen[]>("/ordenes/mias");
          data = resp.data;
        } else if (userRole === "OPERADOR" || userRole === "ADMIN") {
          const resp = await api.get<OrdenResumen[]>("/ordenes");
          data = resp.data;
        } else {
          data = [];
        }

        setOrdenes(data);

        // Inicializar estadoUpdates con el estado actual de cada orden
        const initMap: Record<number, string> = {};
        data.forEach((o) => {
          initMap[o.id] = o.estado;
        });
        setEstadoUpdates(initMap);
      } catch (err: any) {
        console.error("Error al traer las órdenes:", err);
        setError("No se pudo cargar las órdenes. Intenta nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    if (["CLIENTE", "OPERADOR", "ADMIN"].includes(userRole)) {
      fetchOrdenes();
    } else {
      setLoading(false);
    }
  }, [userRole, userId]);

  // ─── 2) Cambiar estado desde la tabla (OPERADOR/ADMIN) ────────────────────────
  const handleChangeState = async (orderId: number) => {
    const nuevoEstado = estadoUpdates[orderId]?.trim();
    if (!nuevoEstado || !estadosDisponibles.includes(nuevoEstado)) {
      return alert("Selecciona un estado válido antes de guardar.");
    }

    try {
      await api.patch(`/ordenes/${orderId}/estado`, { estado: nuevoEstado });
      setOrdenes((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? {
                ...o,
                estado: nuevoEstado,
              }
            : o
        )
      );
      alert(`Estado actualizado a “${nuevoEstado}” para orden #${orderId}.`);
    } catch (err: any) {
      console.error("Error al actualizar la orden:", err);
      if (err.response?.data?.error) {
        alert(`No se pudo cambiar el estado: ${err.response.data.error}`);
      } else {
        alert("No se pudo cambiar el estado. Intenta nuevamente.");
      }
    }
  };

  // ─── 3) Abrir modal y fetch detalle ─────────────────────────────────────────
  const handleVerDetalles = (orderId: number) => {
    setSelectedOrderId(orderId);
    setOpenDialog(true);
    fetchDetalle(orderId);
  };

  const fetchDetalle = async (orderId: number) => {
    setLoadingDetail(true);
    setErrorDetail(null);
    setDetalle(null);

    try {
      const resp = await api.get<DetalleOrden>(`/ordenes/${orderId}`);
      const data = resp.data;
      setDetalle(data);

      if (userRole === "OPERADOR" || userRole === "ADMIN") {
        setEstadoEdit(data.estado);
        setNotasInternasEdit(data.notas_internas || "");
      }
    } catch (err: any) {
      console.error("Error al traer el detalle de la orden:", err);
      if (err.response?.data?.error) {
        setErrorDetail(err.response.data.error);
      } else {
        setErrorDetail("No se pudo cargar el detalle de la orden.");
      }
    } finally {
      setLoadingDetail(false);
    }
  };

  // ─── 4) Guardar cambios desde el modal (OPERADOR/ADMIN) ──────────────────────
  const handleGuardarCambios = async () => {
    if (!detalle || selectedOrderId === null) return;

    const nuevoEstado = estadoEdit.trim();
    if (!estadosDisponibles.includes(nuevoEstado)) {
      return alert("Selecciona un estado válido antes de guardar.");
    }

    try {
      setLoadingDetail(true);
      await api.patch(`/ordenes/${selectedOrderId}/estado`, {
        estado: nuevoEstado,
      });
      alert("Cambios guardados correctamente.");

      setDetalle({
        ...detalle,
        estado: nuevoEstado,
        notas_internas: notasInternasEdit,
      });
      setOrdenes((prev) =>
        prev.map((o) =>
          o.id === selectedOrderId ? { ...o, estado: nuevoEstado } : o
        )
      );
      setEstadoUpdates((prev) => ({
        ...prev,
        [selectedOrderId]: nuevoEstado,
      }));
    } catch (err: any) {
      console.error("Error al actualizar la orden:", err);
      if (err.response?.data?.error) {
        alert(`No se pudo guardar los cambios: ${err.response.data.error}`);
      } else {
        alert("No se pudo guardar los cambios. Intenta nuevamente.");
      }
    } finally {
      setLoadingDetail(false);
    }
  };

  // ─── 5) Cerrar dialog ────────────────────────────────────────────────────────
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOrderId(null);
    setDetalle(null);
    setErrorDetail(null);
    setEstadoEdit("");
    setNotasInternasEdit("");
  };

  // ─── 6) Título según rol ────────────────────────────────────────────────────
  let titulo = "";
  if (userRole === "CLIENTE") {
    titulo = "Mis órdenes";
  } else if (userRole === "OPERADOR" || userRole === "ADMIN") {
    titulo = "Todas las órdenes";
  } else {
    titulo = "No tienes permisos para ver órdenes";
  }

  const rolValido = ["CLIENTE", "OPERADOR", "ADMIN"].includes(userRole);

  return (
    <Box sx={{ mt: 4, mx: "auto", maxWidth: 1000, mb: 6 }}>
      <Typography variant="h4" gutterBottom>
        {titulo}
      </Typography>

      {loading ? (
        <Box className="orderlist-loading">
          <CircularProgress />
        </Box>
      ) : !rolValido ? (
        null
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : ordenes.length === 0 ? (
        <Typography>No hay órdenes para mostrar.</Typography>
      ) : (
        <Table className="orderlist-table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Fecha de creación</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ordenes.map((o) => (
              <TableRow key={o.id}>
                <TableCell>{o.id}</TableCell>
                <TableCell>
                  {new Date(o.fecha_creacion).toLocaleDateString("es-BO", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </TableCell>
                <TableCell>{o.estado}</TableCell>
                <TableCell align="center">
                  {/* Botón “Detalles” */}
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleVerDetalles(o.id)}
                  >
                    Detalles
                  </Button>

                  {/* ─── NUEVO: Cliente VE: “Pagar” si está CONFIRMADO, 
                       o “Pagado” si ya está PAGADO ─── */}
                  {userRole === "CLIENTE" && (
                    <>
                      {o.estado === "CONFIRMADO" && (
                        <Button
                          variant="contained"
                          size="small"
                          color="primary"
                          sx={{ ml: 1 }}
                          onClick={() => nav(`/ordenes/${o.id}/pagar`)}
                        >
                          Pagar
                        </Button>
                      )}
                      {o.estado === "PAGADO" && (
                        <Button
                          variant="outlined"
                          size="small"
                          disabled
                          sx={{ ml: 1 }}
                        >
                          Pagado
                        </Button>
                      )}
                    </>
                  )}

                  {/* OPERADOR/ADMIN: inline select para cambiar estado */}
                  {(userRole === "OPERADOR" || userRole === "ADMIN") && (
                    <Box
                      component="span"
                      sx={{
                        ml: 1,
                        display: "inline-flex",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        select
                        size="small"
                        value={estadoUpdates[o.id] || o.estado}
                        onChange={(e) =>
                          setEstadoUpdates((prev) => ({
                            ...prev,
                            [o.id]: e.target.value,
                          }))
                        }
                        sx={{ width: 130, mr: 1 }}
                      >
                        {estadosDisponibles.map((op) => (
                          <MenuItem key={op} value={op}>
                            {op}
                          </MenuItem>
                        ))}
                      </TextField>

                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleChangeState(o.id)}
                      >
                        Guardar
                      </Button>
                    </Box>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* ─────── DIALOG: Detalle de la orden ────────────────────────────────────── */}
      <Dialog
        fullWidth
        maxWidth="md"
        open={openDialog}
        onClose={handleCloseDialog}
        scroll="paper"
      >
        <DialogTitle>
          {detalle
            ? `Detalle de la orden #${detalle.id}`
            : loadingDetail
            ? "Cargando detalle..."
            : "Detalle no disponible"}
        </DialogTitle>
        <DialogContent dividers>
          {loadingDetail ? (
            <Box className="orderdetail-loading">
              <CircularProgress />
            </Box>
          ) : errorDetail ? (
            <Typography color="error">{errorDetail}</Typography>
          ) : detalle ? (
            <Paper
              className="orderdetail-paper"
              elevation={2}
              sx={{ p: 3, backgroundColor: "#fafafa" }}
            >
              <Grid container spacing={2}>
                {/* Fecha de creación */}
                <Grid item xs={12} md={6}>
                  <Typography
                    variant="subtitle1"
                    className="orderdetail-label"
                  >
                    Fecha de creación:
                  </Typography>
                  <Typography>
                    {new Date(detalle.fecha_creacion).toLocaleString("es-BO", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Typography>
                </Grid>

                {/* Estado */}
                <Grid item xs={12} md={6}>
                  <Typography
                    variant="subtitle1"
                    className="orderdetail-label"
                  >
                    Estado:
                  </Typography>
                  {userRole === "CLIENTE" ? (
                    <Typography className="orderdetail-estado">
                      {detalle.estado}
                    </Typography>
                  ) : (
                    <TextField
                      select
                      label="Estado"
                      value={estadoEdit}
                      onChange={(e) => setEstadoEdit(e.target.value)}
                      fullWidth
                      size="small"
                    >
                      {estadosDisponibles.map((e) => (
                        <MenuItem key={e} value={e}>
                          {e}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                </Grid>

                {/* Datos del cliente */}
                <Grid item xs={12}>
                  <Typography
                    variant="subtitle1"
                    className="orderdetail-label"
                  >
                    Cliente:
                  </Typography>
                  <Typography>
                    {detalle.cliente.nombres} ({detalle.cliente.email})
                  </Typography>
                </Grid>

                {/* ► Listado de TODOS los servicios */}
                <Grid item xs={12}>
                  <Typography
                    variant="subtitle1"
                    className="orderdetail-label"
                  >
                    Servicios contratados:
                  </Typography>
                  {detalle.servicios.map((srv) => (
                    <Box
                      key={srv.id}
                      sx={{
                        mb: 2,
                        p: 1,
                        display: "flex",
                        alignItems: "center",
                        border: "1px solid #ddd",
                        borderRadius: 2,
                      }}
                    >
                      {srv.imagenUrl && (
                        <Box
                          component="img"
                          src={srv.imagenUrl}
                          alt={srv.nombre}
                          sx={{
                            width: 60,
                            height: 60,
                            objectFit: "cover",
                            borderRadius: 1,
                            mr: 2,
                          }}
                        />
                      )}
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body1">{srv.nombre}</Typography>
                        <Typography variant="body2">
                          Precio unitario: {srv.precio_base.toFixed(2)} Bs
                        </Typography>
                        <Typography variant="body2">
                          Cantidad: {srv.cantidad}
                        </Typography>
                        <Typography variant="body2">
                          Subtotal: {srv.subtotal.toFixed(2)} Bs
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Grid>

                {/* Datos del difunto */}
                <Grid item xs={12} md={6}>
                  <Typography
                    variant="subtitle1"
                    className="orderdetail-label"
                  >
                    Nombre del difunto:
                  </Typography>
                  <Typography>{detalle.difunto.nombres}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography
                    variant="subtitle1"
                    className="orderdetail-label"
                  >
                    Fecha de fallecimiento:
                  </Typography>
                  <Typography>
                    {new Date(
                      detalle.difunto.fecha_fallecido
                    ).toLocaleDateString("es-BO", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </Typography>
                </Grid>
                {detalle.difunto.lugar_fallecimiento && (
                  <Grid item xs={12} md={6}>
                    <Typography
                      variant="subtitle1"
                      className="orderdetail-label"
                    >
                      Lugar:
                    </Typography>
                    <Typography>
                      {detalle.difunto.lugar_fallecimiento}
                    </Typography>
                  </Grid>
                )}
                {detalle.difunto.contacto_responsable && (
                  <Grid item xs={12} md={6}>
                    <Typography
                      variant="subtitle1"
                      className="orderdetail-label"
                    >
                      Contacto responsable:
                    </Typography>
                    <Typography>
                      {detalle.difunto.contacto_responsable}
                    </Typography>
                  </Grid>
                )}
                {detalle.difunto.relacion_solicitante && (
                  <Grid item xs={12} md={6}>
                    <Typography
                      variant="subtitle1"
                      className="orderdetail-label"
                    >
                      Relación solicitante:
                    </Typography>
                    <Typography>
                      {detalle.difunto.relacion_solicitante}
                    </Typography>
                  </Grid>
                )}
                {detalle.difunto.notas_adicionales && (
                  <Grid item xs={12}>
                    <Typography
                      variant="subtitle1"
                      className="orderdetail-label"
                    >
                      Notas adicionales:
                    </Typography>
                    <Typography>
                      {detalle.difunto.notas_adicionales}
                    </Typography>
                  </Grid>
                )}

                {/* Total y notas internas (OPERADOR/ADMIN) */}
                <Grid item xs={12} md={6}>
                  <Typography
                    variant="subtitle1"
                    className="orderdetail-label"
                  >
                    Total:
                  </Typography>
                  <Typography>{detalle.total.toFixed(2)} Bs</Typography>
                </Grid>
                {userRole !== "CLIENTE" && (
                  <Grid item xs={12} md={6}>
                    <Typography
                      variant="subtitle1"
                      className="orderdetail-label"
                    >
                      Notas internas:
                    </Typography>
                    <TextField
                      multiline
                      rows={3}
                      value={notasInternasEdit}
                      onChange={(e) =>
                        setNotasInternasEdit(e.target.value)
                      }
                      fullWidth
                      size="small"
                    />
                  </Grid>
                )}
              </Grid>
            </Paper>
          ) : (
            <Typography>No se encontraron datos de la orden.</Typography>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDialog} variant="outlined">
            Cerrar
          </Button>

          {userRole !== "CLIENTE" && detalle && (
            <Button
              onClick={handleGuardarCambios}
              variant="contained"
              disabled={loadingDetail}
            >
              {loadingDetail ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                "Guardar cambios"
              )}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}
