import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Import configurations and middleware
import connectDB from './config/database.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { generalLimiter } from './middleware/rateLimiter.js';

// Import routes
import newsletterRoutes from './routes/newsletter.js';
import donationRoutes from './routes/donation.js';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB asynchronously
let dbConnected = false;
(async () => {
  dbConnected = await connectDB();
  if (dbConnected) {
    console.log('Database: Connected to MongoDB');
  } else {
    console.log('Database: Running without MongoDB - limited functionality');
  }
})();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false
}));

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      process.env.CORS_ORIGIN || 'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:5173',
      'https://eduhopeindia.org',
      'https://www.eduhopeindia.org',
      'https://eduhope-india.vercel.app',
      'https://www.eduhopeindia.me',
      'https://eduhopeindia.me'
    ];
    
    console.log('CORS Check:', { origin, allowedOrigins, envCorsOrigin: process.env.CORS_ORIGIN });
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('CORS Rejected:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
};

app.use(cors(corsOptions));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
app.use(generalLimiter);

// Trust proxy (important for rate limiting behind reverse proxy)
app.set('trust proxy', 1);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'EduHope India Backend API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

// API routes
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/donation', donationRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to EduHope India Backend API',
    version: '1.0.0',    endpoints: {
      health: '/health',
      newsletter: '/api/newsletter',
      donation: '/api/donation',
      documentation: 'API documentation available at /docs (coming soon)'
    }
  });
});

// Handle 404 routes
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const serverUrl = isProduction 
    ? `https://${process.env.RENDER_EXTERNAL_HOSTNAME}` 
    : `http://localhost:${PORT}`;
    
  console.log(`
  EduHope India Backend Server Started
  Environment: ${process.env.NODE_ENV || 'development'}
  Server running on port ${PORT}
  Server URL: ${serverUrl}
  Email Service: Initializing...
  Database: ${dbConnected ? 'Connected' : 'Disconnected'}
  `);
});

// Graceful shutdown on signal interrupt(ctrl+c) or any other termination signal
process.on('SIGTERM', () => {
  console.log(' SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log(' SIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Process terminated');
  });
});

export default app;
