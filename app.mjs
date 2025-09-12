import express from 'express';
import cors from 'cors';
import 'dotenv/config'; // ใช้แทน dotenv.config()

// Import routes
import postRoutes from './route/postRoutes.js';

const app = express();

// Global middleware
app.use(cors({
    origin: [
      'http://localhost:5173',                    // Frontend ตอน dev
      'https://kangwan-blog.vercel.app' // Frontend ตอน production
    ]
  }));
app.use(express.json()); // ใช้แทน bodyParser
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
});

// API Routes
app.use('/posts', postRoutes);

// Health check
app.get('/', (req, res) => {
    res.json({ 
        message: 'Server is running!',
        timestamp: new Date().toISOString(),
        endpoints: {
            posts: '/posts'
        }
    });
});

app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    
    // Don't leak error details in production
    const isDevelopment = process.env.NODE_ENV !== 'production';
    
    res.status(err.status || 500).json({
        error: err.message || 'Internal server error',
        ...(isDevelopment && { stack: err.stack })
    });
});

// 404 handler (ต้องอยู่ท้ายสุด)
app.use((req, res) => {
    res.status(404).json({
        error: 'Route not found',
        requested: req.originalUrl,
        method: req.method,
        availableRoutes: [
            'GET /',
            'GET /health', 
            'GET /posts',
            'POST /posts',
            'PUT /posts/:id',
            'DELETE /posts/:id'
        ]
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('🚀 Server started successfully!');
    console.log(`📍 Server running on http://localhost:${PORT}`);
    console.log(`🔗 API available at http://localhost:${PORT}/posts`);
    console.log(`💊 Health check at http://localhost:${PORT}/health`);
});