const express = require('express');
const router = express.Router();
const multer = require('multer');

// Memory depolama - dosyaları RAM'de tutar
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB limit
});

// Base64 encoding ile resim yükleme
router.post('/', upload.array('images', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'Lütfen en az bir resim yükleyin.' });
    }

    // Resimleri Base64'e dönüştür
    const imageUrls = req.files.map(file => {
      const base64 = file.buffer.toString('base64');
      const dataUrl = `data:${file.mimetype};base64,${base64}`;
      return dataUrl;
    });

    res.status(201).json({ 
      message: 'Resimler başarıyla yüklendi',
      imageUrls 
    });
  } catch (err) {
    console.error('Resim yükleme hatası:', err);
    res.status(500).json({ error: 'Resim yüklenirken bir hata oluştu' });
  }
});

module.exports = router; 