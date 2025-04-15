import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';

const app = express();

app.use(express.json());
app.use(cors());

// Montar las rutas de autenticación en /api/auth
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en el puerto ${PORT}`);
});
