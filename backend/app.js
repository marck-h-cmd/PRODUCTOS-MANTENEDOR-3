const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const winston = require('winston');
const prisma = require('./src/lib/prisma');
const logger = require('./src/lib/logger');
const authRoutes = require('./src/routes/auth');
const productoRoutes = require('./src/routes/productos');
const carritoRoutes = require('./src/routes/carrito');
const ordenRoutes = require('./src/routes/ordenes');
const inventarioRoutes = require('./src/routes/inventario');
const reporteRoutes = require('./src/routes/reportes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());

// Routes versioning
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/productos', productoRoutes);
app.use('/api/v1/carrito', carritoRoutes);
app.use('/api/v1/ordenes', ordenRoutes);
app.use('/api/v1/inventario', inventarioRoutes);
app.use('/api/v1/reportes', reporteRoutes);
// app.use('/api/v1/categorias', categoriaRoutes);
// app.use('/api/v1/clientes', clienteRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date(), version: 'v1' });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Algo salió mal en el servidor',
    errors: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor Express v1 corriendo en http://localhost:${PORT}`);
});

module.exports = { app, prisma, logger };
