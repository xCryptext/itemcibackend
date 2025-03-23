const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./server/db');
const listingsRoutes = require('./server/routes/listings');
const uploadsRoutes = require('./server/routes/uploads');
const healthRoutes = require('./server/routes/health');

// Ortam değişkenlerini yükle
dotenv.config();

// Express uygulaması oluştur
const app = express();

// CORS yapılandırması
app.use(cors({
  origin: ['https://itemci.vercel.app', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// JSON verileri işlemek için middleware
app.use(express.json());

// Log tüm istekleri
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// MongoDB bağlantısı gerekli olmayan endpoint'ler
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'API is running' });
});

// MongoDB bağlantısını asenkron olarak başlat, bağlantı olmadan da çalışabilir
let dbConnected = false;

(async () => {
  try {
    await connectDB();
    dbConnected = true;
    console.log('MongoDB bağlantısı başarılı');
  } catch (error) {
    console.error('MongoDB bağlantısı başarısız:', error);
  }
})();

// MongoDB bağlantısı gerektiren istekler için middleware
const requireDb = (req, res, next) => {
  if (!dbConnected) {
    return res.status(503).json({ 
      error: 'Veritabanı bağlantısı şu anda kullanılamıyor. Lütfen daha sonra tekrar deneyin.'
    });
  }
  next();
};

// API rotalarını tanımla
app.use('/api/listings', requireDb, listingsRoutes);
app.use('/api/uploads', uploadsRoutes);

// Upload klasörünü statik dosya olarak sunma
app.use('/uploads', express.static(path.join(__dirname, 'server/uploads')));

// Health check endpoint'i
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'API is running' });
});

// Tanısal bilgi endpoint'i
app.get('/debug', async (req, res) => {
  try {
    res.json({
      success: true,
      environment: process.env.NODE_ENV,
      vercel: process.env.VERCEL === '1' ? 'Yes' : 'No',
      mongodb_uri_exists: process.env.MONGODB_URI ? 'Yes' : 'No',
      mongodb_uri_start: process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 15) + '...' : 'N/A',
      server_time: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack
    });
  }
});

// Test upload endpoint
app.post('/api/test-upload', (req, res) => {
  console.log('Test upload isteği alındı');
  console.log('Content-Type:', req.headers['content-type']);
  console.log('Body:', req.body);
  
  // İstek multipart/form-data mı kontrol et
  if (req.headers['content-type'] && req.headers['content-type'].includes('multipart/form-data')) {
    res.status(200).json({ success: true, message: 'Multipart istek alındı' });
  } else {
    res.status(400).json({ success: false, message: 'Multipart istek değil' });
  }
});

// Sunucuyu başlat
const PORT = process.env.PORT || 5000;

// Normal Node.js ortamında sunucuyu başlat
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda çalışıyor`);
  });
}

// Vercel serverless için export
module.exports = app; 