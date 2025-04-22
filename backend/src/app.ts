import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

/* …otras rutas… */

// 404 genérico
app.use((_req, res) => res.status(404).json({ error: 'Ruta no encontrada.' }));

// handler de errores
app.use((err: any, _req: express.Request, res: express.Response) => {
  console.error(err);
  res.status(500).json({ error: 'Error del servidor.' });
});

/* -------------------------------------------------
   ¡ESTA línea es la que te falta!
-------------------------------------------------- */
const PORT = process.env.PORT ?? 3001;
app.listen(PORT, () => {
  console.log(`🚀 Backend escuchando en http://localhost:${PORT}`);
});
