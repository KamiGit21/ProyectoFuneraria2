import React, { useEffect } from 'react';
import {
  Box, Card, CardActionArea, Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { useAsync } from '../../hooks/useAsync';
import { getCategorias, Categoria } from '../../api/services';

import * as S from '../../styles/categoriasLandingStyles';   // ← estilos

export default function CategoriasLanding() {
  const nav = useNavigate();
  const { data: cats = [], run } = useAsync<Categoria[]>(getCategorias);

  /* carga inicial */
  useEffect(() => { run(); }, [run]);

  return (
    <Box>
      <Typography variant="h1" gutterBottom>
        Servicios &amp; Productos
      </Typography>

      {/* ---------- GRID de categorías ---------- */}
      <Box sx={S.gridContainer}>
        {cats.map(c => (
          <Card key={c.id} sx={S.cardRoot} variant="outlined">
            <CardActionArea sx={S.actionArea}
                            onClick={() => nav(`/servicios/cat/${c.id}`)}>
              <Box sx={S.contentBox}>
                <Typography sx={S.title}>{c.nombre}</Typography>
              </Box>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
