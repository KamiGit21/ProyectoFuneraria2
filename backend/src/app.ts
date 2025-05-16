//backend/src/app.ts
import express from 'express';
import cors from 'cors';
import { bigintReplacer } from './utils/bigintSerializer';
import listEndpoints from 'express-list-endpoints';

import authRoutes     from './routes/auth.routes';
import clienteRoutes  from './routes/cliente.routes';
import publicRoutes   from './routes/public.routes';
import passwordRoutes from './routes/password.routes';
import serviceRoutes  from './routes/service.routes';
import orderRoutes    from './routes/order.routes';
import importRoutes   from './routes/import.routes';
import categoriaRoutes from './routes/categoria.routes';

const app = express();
console.log('🔍 Endpoints ANTES de montar rutas:');
console.table(listEndpoints(app));

// ─── 1) Cors y JSON ───────────────────────
app.use(cors());
app.use(express.json());
app.set('json replacer', bigintReplacer);

app.get('/api/__test__', (_req, res) => {
  res.json({ ok: true });
});


// ─── 2) Antes de todo: imprime TUS rutas actuales ───


// ─── 3) Logger de petición ────────────────
app.use((req, res, next) => {
  console.log(`→ Recibido ${req.method} ${req.path}`);
  next();
});

// ─── 4) Montaje de tus routers ───────────
app.use('/api/auth',           authRoutes);
app.use('/api/clientes',       clienteRoutes);
app.use('/api/public',         publicRoutes);
app.use('/api/password',       passwordRoutes);
app.use('/api/servicios',      serviceRoutes);
app.use('/api/categorias',     categoriaRoutes);
app.use('/api/ordenes',        orderRoutes);
app.use('/api/importaciones',  importRoutes);

// ─── 5) Después: imprime DE NUEVO tus rutas ───
console.log('✅ Endpoints DESPUÉS de montar rutas:');
console.table(listEndpoints(app));

// ─── 6) 404 y handler ─────────────────────
app.use((_req, res) =>
  res.status(404).json({ error: 'Ruta no encontrada.' })
);
app.use((err: any, _req: express.Request, res: express.Response) => {
  console.error(err);
  res.status(500).json({ error: 'Error del servidor.' });
});

export default app;
