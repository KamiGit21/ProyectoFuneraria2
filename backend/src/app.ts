// backend/src/app.ts
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import clienteRoutes from './routes/cliente.routes'; // Asegúrate de que esta línea esté

const app = express();

app.use(express.json());
app.use(cors());

// Monta las rutas de autenticación y de clientes
app.use('/api/auth', authRoutes);
app.use('/api/clientes', clienteRoutes); // Esto define la ruta base

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en el puerto ${PORT}`);
});
