import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import clienteRoutes from './routes/cliente.routes';
import publicRoutes from './routes/public.routes';
import passwordRoutes from './routes/password.routes';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/password', passwordRoutes);
// 404 y error handler...


// 404
app.use((_req, res) =>
  res.status(404).json({ error: 'Ruta no encontrada.' })
)

// Error handler
app.use((err: any, _req: express.Request, res: express.Response) => {
  console.error(err)
  res.status(500).json({ error: 'Error del servidor.' })
})

const PORT = process.env.PORT ?? 3001
app.listen(PORT, () =>
  console.log(`🚀 Backend escuchando en http://localhost:${PORT}`)
)
// TODO: pon aquí también tus rutas protegidas (/api/auth, /api/clientes, …)
app.use('/api/public', publicRoutes)