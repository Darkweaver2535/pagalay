const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const morgan = require('morgan');
const { createServer } = require('http');
const { Server } = require('socket.io');

require('dotenv').config();

const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');

// Importar rutas
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const transactionRoutes = require('./routes/transactions');
const vendorRoutes = require('./routes/vendors');
const exchangeRoutes = require('./routes/exchange');
const qrRoutes = require('./routes/qr');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URLS?.split(',') || ["http://localhost:3000"],
    methods: ["GET", "POST"]
  }
});

// Trust proxy
app.set('trust proxy', 1);

// Middlewares de seguridad
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por ventana por IP
  message: {
    error: 'Demasiadas solicitudes desde esta IP, intenta de nuevo en 15 minutos.'
  }
});

app.use('/api/', limiter);

// Logging
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Data sanitization
app.use(mongoSanitize());
app.use(xss());

// CORS
app.use(cors({
  origin: process.env.CLIENT_URLS?.split(',') || ["http://localhost:3000"],
  credentials: true
}));

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pagalay', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  logger.info('✅ Conectado a MongoDB');
})
.catch((err) => {
  logger.error('❌ Error conectando a MongoDB:', err.message);
  process.exit(1);
});

// Socket.IO para notificaciones en tiempo real
io.on('connection', (socket) => {
  logger.info(`👤 Usuario conectado: ${socket.id}`);
  
  socket.on('join_room', (room) => {
    socket.join(room);
    logger.info(`👤 Usuario ${socket.id} se unió a la sala: ${room}`);
  });

  socket.on('disconnect', () => {
    logger.info(`👤 Usuario desconectado: ${socket.id}`);
  });
});

// Hacer io accesible en toda la aplicación
app.set('socketio', io);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Pagalay API funcionando correctamente',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// Rutas API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/exchange', exchangeRoutes);
app.use('/api/qr', qrRoutes);

// Ruta 404
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    message: `No se pudo encontrar ${req.originalUrl} en el servidor`
  });
});

// Middleware de manejo de errores
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  logger.info(`🚀 Servidor Pagalay ejecutándose en puerto ${PORT}`);
  logger.info(`📱 Modo: ${process.env.NODE_ENV || 'development'}`);
});

// Manejo de errores no capturados
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err);
  process.exit(1);
});

module.exports = app;
