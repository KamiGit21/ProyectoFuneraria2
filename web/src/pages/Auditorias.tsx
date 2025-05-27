import React, { useState, useEffect, useCallback, useContext } from 'react';
import {
  Container,
  Typography,
  TextField,
  MenuItem,
  Select,
  Alert,
  Box,
  InputLabel,
  FormControl,
  CircularProgress,
} from '@mui/material';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { format, isValid } from 'date-fns';
import { debounce } from 'lodash';
import api from '../api/axiosInstance';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface AuditLog {
  id: number;
  user: string;
  tabla: string;
  operacion: string;
  realizado_en: string;
}

interface User {
  id: number;
  nombre_usuario: string;
}

const Auditorias: React.FC = () => {
  const { user } = useContext(AuthContext) || {};
  const navigate = useNavigate();
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [filterUser, setFilterUser] = useState<string>('');
  const [filterTabla, setFilterTabla] = useState<string>('');
  const [filterDate, setFilterDate] = useState<string>('');
  const [dateError, setDateError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [totalLogs, setTotalLogs] = useState<number>(0);
  const [error, setError] = useState<string>('');
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });

  const tablaMap: { [key: string]: string } = {
    servicio: 'Servicios',
    obituario: 'Obituarios',
    usuario: 'Usuarios',
    orden: 'Órdenes',
    difunto: 'Difuntos',
    condolencia: 'Condolencias',
    // Add other tables as needed
  };

  const operacionMap: { [key: string]: string } = {
    INSERT: 'Creado',
    UPDATE: 'Editado',
    DELETE: 'Eliminado',
  };

  const tablas = Object.keys(tablaMap);

  const columns: GridColDef[] = [
    { field: 'user', headerName: 'Usuario', width: 200 },
    {
      field: 'realizado_en',
      headerName: 'Fecha y Hora',
      width: 200,
      valueFormatter: ({ value }) => format(new Date(value), 'dd/MM/yyyy HH:mm:ss'),
    },
    {
      field: 'tabla',
      headerName: 'Módulo',
      width: 150,
      valueGetter: ({ value }) => tablaMap[value] || value,
    },
    {
      field: 'operacion',
      headerName: 'Acción',
      width: 150,
      valueGetter: ({ value }) => operacionMap[value] || value,
    },
  ];

  const fetchUsers = useCallback(async () => {
    if (!user || user.rol !== 'ADMIN') return;
    try {
      const response = await api.get('/usuarios');
      setUsers(response.data || []);
    } catch (error: any) {
      const errMsg = error.response?.data?.error || 'Error al cargar los usuarios';
      setError(errMsg);
      if (error.response?.status === 401 || error.response?.status === 403) {
        navigate('/login');
      }
    }
  }, [user, navigate]);

  const fetchLogs = useCallback(async () => {
    if (!user || user.rol !== 'ADMIN') {
      setError('Acceso no autorizado');
      navigate('/login');
      return;
    }
    setLoading(true);
    try {
      const params: any = {
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
      };
      if (filterUser) params.user = filterUser;
      if (filterTabla) params.tabla = filterTabla;
      if (filterDate) params.date = filterDate;

      const response = await api.get('/auditoria', { params });
      setAuditLogs(response.data.logs || []);
      setTotalLogs(response.data.total || 0);
    } catch (error: any) {
      const errMsg = error.response?.data?.error || 'Error al cargar los registros de auditoría';
      setError(errMsg);
      if (error.response?.status === 401 || error.response?.status === 403) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [user, filterUser, filterTabla, filterDate, paginationModel, navigate]);

  const debouncedFetchLogs = useCallback(debounce(fetchLogs, 300), [fetchLogs]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilterDate(value);
    if (value && !isValid(new Date(value))) {
      setDateError('Fecha inválida');
    } else {
      setDateError('');
      debouncedFetchLogs();
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchLogs();
  }, [fetchUsers, fetchLogs]);

  return (
    <Container maxWidth="lg" sx={{ mt: 8, mb: 4 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#3A4A58' }}
      >
        Auditorías
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      <Box display="flex" gap={2} mb={2} flexWrap="wrap">
        <FormControl sx={{ flex: '1 1 300px' }}>
          <InputLabel sx={{ fontFamily: "'Source Sans Pro', sans-serif" }}>
            Filtrar por usuario
          </InputLabel>
          <Select
            value={filterUser}
            onChange={(e) => {
              setFilterUser(e.target.value);
              debouncedFetchLogs();
            }}
            variant="outlined"
            sx={{ fontFamily: "'Source Sans Pro', sans-serif" }}
          >
            <MenuItem value="">Todos</MenuItem>
            {users.map((u) => (
              <MenuItem key={u.id} value={u.nombre_usuario}>
                {u.nombre_usuario}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ flex: '1 1 300px' }}>
          <InputLabel sx={{ fontFamily: "'Source Sans Pro', sans-serif" }}>
            Filtrar por módulo
          </InputLabel>
          <Select
            value={filterTabla}
            onChange={(e) => {
              setFilterTabla(e.target.value);
              debouncedFetchLogs();
            }}
            variant="outlined"
            sx={{ fontFamily: "'Source Sans Pro', sans-serif" }}
          >
            <MenuItem value="">Todos</MenuItem>
            {tablas.map((tabla) => (
              <MenuItem key={tabla} value={tabla}>
                {tablaMap[tabla]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Filtrar por fecha"
          type="date"
          variant="outlined"
          value={filterDate}
          onChange={handleDateChange}
          error={!!dateError}
          helperText={dateError}
          InputLabelProps={{ shrink: true }}
          sx={{ flex: '1 1 300px', fontFamily: "'Source Sans Pro', sans-serif" }}
        />
      </Box>
      <Box sx={{ height: 600, width: '100%' }}>
        {loading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 2 }} />}
        <DataGrid
          rows={auditLogs}
          columns={columns}
          paginationMode="server"
          rowCount={totalLogs}
          loading={loading}
          pageSizeOptions={[10, 25, 50]}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          disableRowSelectionOnClick
          sx={{ fontFamily: "'Source Sans Pro', sans-serif", backgroundColor: '#FFFFFF' }}
        />
      </Box>
    </Container>
  );
};

export default Auditorias;
