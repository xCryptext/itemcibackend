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

// Kullanıcının kendi ilanlarını getir
app.get('/api/listings', (req, res) => {
  const { seller } = req.query;
  
  // Seller parametresi varsa, sadece o satıcıya ait ilanları filtrele
  if (seller) {
    console.log(`${seller} adresine ait ilanlar istendi`);
    
    // Demo ilanlar - gerçek uygulamada veritabanından gelecek
    const filteredListings = [
      {
        _id: 'demo_seller_1',
        title: 'Satıcıya Ait Ürün 1',
        description: 'Bu bir demo üründür',
        price: 100,
        cryptoCurrency: 'ETH',
        seller: seller,
        images: ['https://via.placeholder.com/800x600?text=Demo+Seller+1'],
        status: 'active',
        createdAt: new Date().toISOString()
      },
      {
        _id: 'demo_seller_2',
        title: 'Satıcıya Ait Ürün 2', 
        description: 'İkinci demo ürün',
        price: 200,
        cryptoCurrency: 'ETH',
        seller: seller,
        images: ['https://via.placeholder.com/800x600?text=Demo+Seller+2'],
        status: 'active',
        createdAt: new Date().toISOString()
      }
    ];
    
    return res.json({
      success: true,
      count: filteredListings.length,
      listings: filteredListings
    });
  }
  
  // Seller parametresi yoksa, tüm ilanları getir
  // ... mevcut kod ...
});

// Yeni ilan oluşturma endpoint'i
app.post('/api/listings', (req, res) => {
  try {
    console.log('Yeni ilan oluşturma isteği:', req.body);
    
    // Gerekli alanları kontrol et
    const { title, description, price, cryptoCurrency, seller, images } = req.body;
    
    if (!title || !description || !price || !seller) {
      return res.status(400).json({
        success: false,
        error: 'Lütfen tüm zorunlu alanları doldurun.'
      });
    }
    
    // Demo yeni ilan oluştur
    const newListing = {
      _id: 'demo_' + Date.now(),
      title,
      description,
      price: Number(price),
      cryptoCurrency: cryptoCurrency || 'ETH',
      seller,
      images: images || [],
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Başarılı yanıt
    res.status(201).json({
      success: true,
      listing: newListing
    });
  } catch (error) {
    console.error('İlan oluşturma hatası:', error);
    res.status(500).json({
      success: false,
      error: 'İlan oluşturulurken bir hata oluştu.'
    });
  }
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

// İlan detayı endpoint'i
app.get('/api/listings/:id', (req, res) => {
  const listingId = req.params.id;
  console.log('İlan detayı isteği:', listingId);
  
  // Demo ilan örneği oluştur
  const listing = {
    _id: listingId,
    title: 'Demo Ürün Detayı',
    description: 'Bu bir demo ürün detayıdır. API henüz gerçek veritabanı ile çalışmıyor.',
    price: 150,
    cryptoCurrency: 'ETH',
    seller: '0x123456789abcdef',
    images: [
      'https://via.placeholder.com/800x600?text=Demo+Detay+1',
      'https://via.placeholder.com/800x600?text=Demo+Detay+2'
    ],
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  return res.json({
    success: true,
    listing
  });
});

// İlan güncelleme endpoint'i
app.put('/api/listings/:id', (req, res) => {
  const listingId = req.params.id;
  console.log('İlan güncelleme isteği:', listingId, req.body);
  
  // Demo güncelleme yanıtı
  return res.json({
    success: true,
    listing: {
      _id: listingId,
      ...req.body,
      updatedAt: new Date().toISOString()
    }
  });
});

// İlan silme endpoint'i
app.delete('/api/listings/:id', (req, res) => {
  const listingId = req.params.id;
  console.log('İlan silme isteği:', listingId);
  
  return res.json({
    success: true,
    message: 'İlan başarıyla silindi'
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