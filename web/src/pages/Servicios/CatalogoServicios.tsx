import React, { useEffect, useContext, useState, useRef } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Stack,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate, useParams } from 'react-router-dom';

import { useAsync }  from '../../hooks/useAsync';
import {
  Servicio, getServicios, deleteServicio,
  Categoria, getCategorias,
} from '../../api/services';
import { AuthContext } from '../../contexts/AuthContext';
import { useCart }     from '../../contexts/CartContext';

import * as S from '../../styles/catalogoServiciosStyles';   //  ←  estilos

export default function CatalogoServicios() {
  const { id: catId }   = useParams<{ id?: string }>();
  const nav             = useNavigate();
  const { user }        = useContext(AuthContext)!;
  const { addItem }     = useCart();

  /* ------ datos ------------------------------------------------------- */
  const { data: servicios = [],  run: loadServicios  } = useAsync(() => getServicios(catId));
  const { data: categorias = [], run: loadCategorias } = useAsync<Categoria[]>(getCategorias);

  const [catName, setCatName] = useState<string | null>(null);

  /* carga inicial categorías (una vez) */
  const mounted = useRef(false);
  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;
    loadCategorias();
  }, [loadCategorias]);

  /* recarga lista al cambiar categoría */
  useEffect(() => { loadServicios(); }, [loadServicios, catId]);

  /* resuelve título */
  useEffect(() => {
    if (catId && categorias.length) {
      const c = categorias.find(c => String(c.id) === String(catId));
      setCatName(c?.nombre ?? `#${catId}`);
    } else { setCatName(null); }
  }, [catId, categorias]);

  /* handlers */
  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este servicio?')) return;
    await deleteServicio(id);
    loadServicios();
  };
  const handleAdd = (s: Servicio) => {
    if (!user) return nav('/login');
    addItem(s);
  };

  /* --------------------------- UI ------------------------------------ */
  return (
    <Box>
      {/* -------- encabezado + botón NUEVO ---------------------------- */}
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" mb={3}>
        <Typography variant="h1">
          {catId ? `Servicios de ${catName}` : 'Servicios Funerarios'}
        </Typography>

        {user?.rol === 'ADMIN' && (
          <Button
            onClick={() => nav('/servicios/nuevo')}
            aria-label="Nuevo servicio"
            sx={{
              width: 40, height: 40, minWidth: 0,
              borderRadius: '50%',
              border: '2px solid', borderColor: 'primary.main',
              color: 'primary.main',
              '&:hover': { backgroundColor: 'rgba(25,118,210,.04)' },
            }}
          >
            <AddIcon />
          </Button>
        )}
      </Stack>

      {/* -------- GRID de tarjetas ------------------------------------ */}
      <Box sx={S.gridContainer}>
        {servicios.map(s => {
          const precio = Number(s.precio_base) || 0;
          return (
            <Card key={s.id} variant="outlined" sx={S.cardRoot}>
              <CardContent sx={S.cardContent}>
                <Typography sx={S.cardHeader}>{s.nombre}</Typography>

                {s.descripcion && (
                  <Typography sx={S.cardDescription} color="text.secondary">
                    {s.descripcion}
                  </Typography>
                )}

                <Typography variant="h6" color="secondary">
                  Bs {precio.toFixed(2)}
                </Typography>
              </CardContent>

              <Stack spacing={1} sx={S.actionStack}>
                {user?.rol === 'ADMIN'
                  ? (
                    <>
                      <Button fullWidth variant="outlined" color="error"
                              startIcon={<DeleteIcon />}
                              onClick={() => handleDelete(String(s.id))}>
                        Eliminar
                      </Button>
                      <Button fullWidth variant="outlined"
                              onClick={() => nav(`/servicios/editar/${s.id}`)}>
                        Editar
                      </Button>
                    </>
                  )
                  : (
                    <Button fullWidth variant="contained" onClick={() => handleAdd(s)}>
                      Añadir al carrito
                    </Button>
                  )}
              </Stack>
            </Card>
          );
        })}
      </Box>
    </Box>
  );
}
