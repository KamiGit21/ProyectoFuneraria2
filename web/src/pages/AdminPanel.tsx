import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import {
  Button,
  TextField,
  Typography,
  Container,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

interface Usuario {
  id: number;
  nombre_usuario: string;
  email: string;
  rol: string;
  estado: "ACTIVO" | "INACTIVO";
}

export default function AdminPanel() {
  const { user } = useContext(AuthContext)!;
  const navigate = useNavigate();

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [nuevo, setNuevo] = useState({
    nombre_usuario: "",
    email: "",
    password: "",
    rol: "USUARIO",
    estado: "ACTIVO",
  });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [pwdError, setPwdError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Regex: al menos una mayúscula y un dígito
  const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d).+$/;

  // Protege el acceso
  useEffect(() => {
    if (!user || user.email !== "admin.general@funeraria.com") {
      navigate("/login");
    } else {
      obtenerUsuarios();
    }
  }, [user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNuevo(prev => ({ ...prev, [name]: value }));

    if (name === 'password') {
      if (!PASSWORD_REGEX.test(value)) {
        setPwdError('Debe tener ≥1 mayúscula y ≥1 número');
      } else {
        setPwdError('');
      }
    }
  };

  const obtenerUsuarios = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Sesión expirada. Por favor, inicia sesión nuevamente.");
      navigate("/login");
      return;
    }
    try {
      const res = await api.get<Usuario[]>("/api/usuarios", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("API response:", res.data);
      setUsuarios(res.data);
      setError("");
    } catch (error: any) {
      console.error("Fetch error:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("token");
        setError("Sesión no autorizada. Por favor, inicia sesión nuevamente.");
        navigate("/login");
      } else if (error.response?.status === 404) {
        setError("Ruta de usuarios no encontrada. Verifica la configuración del servidor.");
      } else {
        setError(error.response?.data?.error || "Error al obtener usuarios.");
      }
    } finally {
      setLoading(false);
    }
  };

  const crearUsuario = async () => {
    const token = localStorage.getItem("token");
    if (!nuevo.nombre_usuario || !nuevo.email || !nuevo.password) {
      setError("Por favor, completa todos los campos requeridos.");
      return;
    }
    if (!PASSWORD_REGEX.test(nuevo.password)) {
      setPwdError("La contraseña debe tener al menos una mayúscula y un número");
      return;
    }
    try {
      await api.post("/usuarios", nuevo, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNuevo({ nombre_usuario: "", email: "", password: "", rol: "USUARIO", estado: "ACTIVO" });
      setShowCreateForm(false);
      setSuccess("Usuario creado exitosamente.");
      setError("");
      setPwdError("");
      setTimeout(() => obtenerUsuarios(), 1500);
    } catch (error: any) {
      console.error("Create error:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("token");
        setError("Sesión no autorizada. Por favor, inicia sesión nuevamente.");
        navigate("/login");
      } else {
        setError(error.response?.data?.error || "Error al crear el usuario.");
      }
    }
  };

  const actualizarUsuario = async (id: number, rol: string, estado: string) => {
    const token = localStorage.getItem("token");
    try {
      await api.patch(`/usuarios/${id}`, { rol, estado }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Usuario actualizado correctamente.");
      setError("");
      setTimeout(() => obtenerUsuarios(), 1500);
    } catch (error: any) {
      console.error("Update error:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("token");
        setError("Sesión no autorizada. Por favor, inicia sesión nuevamente.");
        navigate("/login");
      } else {
        setError(error.response?.data?.error || "Error al actualizar el usuario.");
      }
    }
  };

  const eliminarUsuario = async (id: number) => {
    const token = localStorage.getItem("token");
    try {
      await api.delete(`/usuarios/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Usuario eliminado correctamente.");
      setError("");
      setTimeout(() => obtenerUsuarios(), 1500);
    } catch (error: any) {
      console.error("Delete error:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("token");
        setError("Sesión no autorizada. Por favor, inicia sesión nuevamente.");
        navigate("/login");
      } else {
        setError(error.response?.data?.error || "Error al eliminar el usuario.");
      }
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Panel de Administración
      </Typography>

      {/* Mensajes de Error y Éxito */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      {/* Tabla de Usuarios */}
      <Typography variant="h6" gutterBottom>
        Usuarios Registrados
      </Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Usuario</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usuarios.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No hay usuarios disponibles.
                </TableCell>
              </TableRow>
            ) : (
              usuarios.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>{u.nombre_usuario}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>
                    <FormControl fullWidth>
                      <InputLabel>Rol</InputLabel>
                      <Select
                        value={u.rol}
                        onChange={(e) => actualizarUsuario(u.id, e.target.value, u.estado)}
                        label="Rol"
                      >
                        <MenuItem value="USUARIO">Usuario</MenuItem>
                        <MenuItem value="ADMIN">Admin</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    <FormControl fullWidth>
                      <InputLabel>Estado</InputLabel>
                      <Select
                        value={u.estado}
                        onChange={(e) => actualizarUsuario(u.id, u.rol, e.target.value)}
                        label="Estado"
                      >
                        <MenuItem value="ACTIVO">Activo</MenuItem>
                        <MenuItem value="INACTIVO">Inactivo</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => eliminarUsuario(u.id)}
                    >
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}

      {/* Botón para Mostrar Formulario */}
      {!showCreateForm && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => setShowCreateForm(true)}
          sx={{ mt: 4 }}
        >
          Crear Usuario
        </Button>
      )}

      {/* Formulario para Crear Usuario */}
      {showCreateForm && (
        <>
          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            Crear Usuario
          </Typography>
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Usuario"
              name="nombre_usuario"
              value={nuevo.nombre_usuario}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Email"
              name="email"
              value={nuevo.email}
              onChange={handleChange}
              fullWidth
              margin="normal"
              type="email"
              required
            />
            <TextField
              label="Contraseña"
              name="password"
              value={nuevo.password}
              onChange={handleChange}
              fullWidth
              margin="normal"
              type={showPassword ? "text" : "password"}
              required
              error={Boolean(pwdError)}
              helperText={pwdError}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      onClick={() => setShowPassword(v => !v)}
                      aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Rol</InputLabel>
              <Select
                value={nuevo.rol}
                onChange={(e) => setNuevo({ ...nuevo, rol: e.target.value })}
                label="Rol"
              >
                <MenuItem value="USUARIO">Usuario</MenuItem>
                <MenuItem value="ADMIN">Admin</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Estado</InputLabel>
              <Select
                value={nuevo.estado}
                onChange={(e) => setNuevo({ ...nuevo, estado: e.target.value })}
                label="Estado"
              >
                <MenuItem value="ACTIVO">Activo</MenuItem>
                <MenuItem value="INACTIVO">Inactivo</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <Button
                onClick={crearUsuario}
                variant="contained"
                color="primary"
              >
                Crear
              </Button>
              <Button
                onClick={() => {
                  setShowCreateForm(false);
                  setNuevo({ nombre_usuario: "", email: "", password: "", rol: "USUARIO", estado: "ACTIVO" });
                  setError("");
                  setPwdError("");
                }}
                variant="outlined"
                color="secondary"
              >
                Cancelar
              </Button>
            </Box>
          </Box>
        </>
      )}
    </Container>
  );
}