import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.routes'
import clienteRoutes from './routes/cliente.routes'
import publicRoutes from './routes/public.routes'
//import adminRoutes from './routes/admin.routes'

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/clientes', clienteRoutes)
app.use('/api/public', publicRoutes)   // ← NUEVO
//app.use('/api/usuarios', adminRoutes)

// 404
app.all('*', (_req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada.' })
})

// Error handler
app.use((err: any, _req: express.Request, res: express.Response) => {
  console.error(err)
  res.status(500).json({ error: 'Error del servidor.' })
})

const PORT = process.env.PORT ?? 3001
app.listen(PORT, () =>
  console.log(`🚀 Backend escuchando en http://localhost:${PORT}`)
)