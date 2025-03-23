const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Ortam değişkenlerini yükle
dotenv.config();

// Express uygulaması oluştur
const app = express();

// CORS yapılandırması
app.use(cors());

// JSON verileri işlemek için middleware
app.use(express.json());

// Log tüm istekleri
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Basit API endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

// Test endpoint'i
app.get('/api/listings', (req, res) => {
  // Demo ilan listesi
  const listings = [
    {
      _id: 'demo1',
      title: 'Demo Ürün 1',
      description: 'Bu bir demo üründür',
      price: 100,
      seller: '0x123456789',
      images: ['https://via.placeholder.com/800x600?text=Demo+1'],
      status: 'active',
      createdAt: new Date().toISOString()
    },
    {
      _id: 'demo2',
      title: 'Demo Ürün 2', 
      description: 'İkinci demo ürün',
      price: 200,
      seller: '0x987654321',
      images: ['https://via.placeholder.com/800x600?text=Demo+2'],
      status: 'active',
      createdAt: new Date().toISOString()
    }
  ];
  
  return res.json({
    success: true,
    count: listings.length,
    listings
  });
});

// Test upload endpoint
app.post('/api/uploads', (req, res) => {
  const demoImageUrls = [
    'https://via.placeholder.com/800x600?text=Demo+Image+1',
    'https://via.placeholder.com/800x600?text=Demo+Image+2'
  ];
  
  res.status(200).json({
    success: true,
    message: 'Demo resimler kullanıldı',
    imageUrls: demoImageUrls
  });
});

// Debug info
app.get('/debug', (req, res) => {
  res.json({
    env: process.env.NODE_ENV,
    time: new Date().toISOString(),
    nodeVersion: process.version
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint bulunamadı'
  });
});

// Hata yakalama
app.use((err, req, res, next) => {
  console.error('Sunucu hatası:', err);
  res.status(500).json({
    success: false,
    message: 'Sunucu hatası',
    error: process.env.NODE_ENV === 'production' ? null : err.message
  });
});

// Port numarası
const PORT = process.env.PORT || 5000;

// Normal Node.js ortamında sunucuyu başlat
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda çalışıyor`);
  });
}

// Vercel için gerekli
module.exports = app; 