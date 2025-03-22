const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./server/db');
const listingsRoutes = require('./server/routes/listings');

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

// MongoDB bağlantısını başlat
connectDB();

// API rotalarını tanımla
app.use('/api/listings', listingsRoutes);

// Health check endpoint'i
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'API is running' });
});

// Tanısal bilgi endpoint'i
app.get('/debug', (req, res) => {
  res.json({
    env: process.env.NODE_ENV,
    workingDirectory: __dirname,
    files: require('fs').readdirSync(__dirname),
    mongodbUri: process.env.MONGODB_URI ? "Ayarlanmış" : "Ayarlanmamış"
  });
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