const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Cloudinary yapılandırması
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Cloudinary depolama
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'itemci-uploads',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif']
  }
});

const upload = multer({ storage: storage });

// Çoklu resim upload endpoint'i
router.post('/', upload.array('images', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ 
        error: 'Lütfen en az bir resim yükleyin.' 
      });
    }

    // Cloudinary URL'leri doğrudan req.files içinde
    const imageUrls = req.files.map(file => file.path);

    res.status(201).json({ 
      message: 'Resimler başarıyla yüklendi',
      imageUrls 
    });
  } catch (err) {
    console.error('Resim yükleme hatası:', err);
    res.status(500).json({ 
      error: 'Resim yüklenirken bir hata oluştu: ' + err.message 
    });
  }
});

module.exports = router; 