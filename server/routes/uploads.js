const express = require('express');
const router = express.Router();
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Örnek resim URL'leri
const demoImages = [
  'https://via.placeholder.com/800x600?text=Ürün+1',
  'https://via.placeholder.com/800x600?text=Ürün+2',
  'https://via.placeholder.com/800x600?text=Ürün+3',
  'https://via.placeholder.com/800x600?text=Ürün+4',
  'https://via.placeholder.com/800x600?text=Ürün+5'
];

router.post('/', upload.array('images', 5), (req, res) => {
  // Gönderilen resim sayısı kadar resim URL'si döndür
  const count = Math.min(req.files ? req.files.length : 1, 5);
  const imageUrls = demoImages.slice(0, count);
  
  res.status(201).json({
    message: 'Resimler başarıyla yüklendi (demo)',
    imageUrls
  });
});

module.exports = router; 