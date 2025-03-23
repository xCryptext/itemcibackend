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

// Basit in-memory depo
const inMemoryStore = {
  listings: [
    // İlk demo veriler
    {
      _id: 'demo_1',
      title: 'Demo Ürün 1',
      description: 'Bu bir demo üründür',
      price: 100,
      cryptoCurrency: 'ETH',
      seller: '0x123456789abcdef',
      images: ['https://via.placeholder.com/800x600?text=Demo+1'],
      status: 'active',
      createdAt: new Date().toISOString()
    },
    {
      _id: 'demo_2',
      title: 'Demo Ürün 2', 
      description: 'İkinci demo ürün',
      price: 200,
      cryptoCurrency: 'ETH',
      seller: '0x987654321',
      images: ['https://via.placeholder.com/800x600?text=Demo+2'],
      status: 'active',
      createdAt: new Date().toISOString()
    }
  ],
  deals: []
};

// Genel ilanları getir (tüm veriler)
app.get('/api/listings', (req, res) => {
  const { seller } = req.query;
  
  // Seller parametresi varsa, sadece o satıcıya ait ilanları filtrele
  if (seller) {
    console.log(`${seller} adresine ait ilanlar istendi`);
    
    const filteredListings = inMemoryStore.listings.filter(
      listing => listing.seller.toLowerCase() === seller.toLowerCase()
    );
    
    return res.json({
      success: true,
      count: filteredListings.length,
      listings: filteredListings
    });
  }
  
  // Tüm ilanları döndür
  return res.json({
    success: true,
    count: inMemoryStore.listings.length,
    listings: inMemoryStore.listings
  });
});

// Belirli bir satıcının ilanlarını getir
app.get('/api/listings/seller/:address', (req, res) => {
  const sellerAddress = req.params.address;
  console.log(`${sellerAddress} adresine ait ilanlar istendi (seller/:address)`);
  
  const filteredListings = inMemoryStore.listings.filter(
    listing => listing.seller.toLowerCase() === sellerAddress.toLowerCase()
  );
  
  return res.json({
    success: true,
    count: filteredListings.length,
    listings: filteredListings
  });
});

// Yeni ilan oluşturma
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
    
    // Yeni ilan oluştur
    const newListing = {
      _id: 'listing_' + Date.now(),
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
    
    // Listeye ekle
    inMemoryStore.listings.push(newListing);
    
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

// İlan güncelleme endpoint'i
app.put('/api/listings/:id', (req, res) => {
  const listingId = req.params.id;
  console.log('İlan güncelleme isteği:', listingId, req.body);
  
  // İlanı bul
  const index = inMemoryStore.listings.findIndex(listing => listing._id === listingId);
  
  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: 'İlan bulunamadı'
    });
  }
  
  // İlanı güncelle
  inMemoryStore.listings[index] = {
    ...inMemoryStore.listings[index],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  
  return res.json({
    success: true,
    listing: inMemoryStore.listings[index]
  });
});

// İlan silme endpoint'i
app.delete('/api/listings/:id', (req, res) => {
  const listingId = req.params.id;
  console.log('İlan silme isteği:', listingId);
  
  // İlanı bul
  const index = inMemoryStore.listings.findIndex(listing => listing._id === listingId);
  
  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: 'İlan bulunamadı'
    });
  }
  
  // İlanı sil
  inMemoryStore.listings.splice(index, 1);
  
  return res.json({
    success: true,
    message: 'İlan başarıyla silindi'
  });
});

// İlan detayını getir
app.get('/api/listings/:id', (req, res) => {
  const listingId = req.params.id;
  console.log('İlan detayı isteği:', listingId);
  
  // İlanı bul
  const listing = inMemoryStore.listings.find(item => item._id === listingId);
  
  if (!listing) {
    return res.status(404).json({
      success: false,
      error: 'İlan bulunamadı'
    });
  }
  
  return res.json({
    success: true,
    listing
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

// Deal endpoint'i için mock veri ekleyelim
app.get('/api/deals/seller/:address', (req, res) => {
  const sellerAddress = req.params.address;
  console.log(`${sellerAddress} adresine ait deals istendi`);
  
  // Veri formatı standardizasyonu - boş bile olsa bir array dönmeli
  return res.json({
    success: true,
    deals: [] // Boş dizi veya mock veriler
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