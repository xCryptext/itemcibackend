const express = require('express');
const router = express.Router();
const Listing = require('../../models/Listing');
const auth = require('../middleware/auth');

// Tüm ilanları getir
router.get('/', async (req, res) => {
  try {
    // URL parametrelerinden filtreleri al
    const { keyword, minPrice, maxPrice, status, sortBy, sortOrder } = req.query;
    
    // Filtreleme koşullarını oluştur
    const filter = {};
    
    if (keyword) {
      filter.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } }
      ];
    }
    
    if (minPrice) filter.price = { ...filter.price, $gte: parseFloat(minPrice) };
    if (maxPrice) filter.price = { ...filter.price, $lte: parseFloat(maxPrice) };
    if (status) filter.status = status;
    
    // Sıralama seçeneklerini oluştur
    const sort = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    } else {
      sort.createdAt = -1; // Varsayılan olarak en yeni ilanlar önce
    }
    
    const listings = await Listing.find(filter).sort(sort);
    res.json(listings);
  } catch (err) {
    console.error('İlanlar getirilirken hata:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// ID ile ilan getir
router.get('/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    
    if (!listing) {
      return res.status(404).json({ message: 'İlan bulunamadı' });
    }
    
    res.json(listing);
  } catch (err) {
    console.error('İlan detayı getirilirken hata:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// Yeni ilan oluştur (auth middleware kullanarak)
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, price, images, cryptoCurrency, seller } = req.body;
    
    // Auth middleware'den gelen kullanıcı ile karşılaştır
    if (req.user.toLowerCase() !== seller.toLowerCase()) {
      return res.status(403).json({ message: 'Yetkilendirme hatası' });
    }
    
    const newListing = new Listing({
      title,
      description,
      price,
      images,
      cryptoCurrency,
      seller
    });
    
    const savedListing = await newListing.save();
    res.status(201).json(savedListing);
  } catch (err) {
    console.error('İlan oluşturulurken hata:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// İlan güncelle
router.put('/:id', auth, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    
    if (!listing) {
      return res.status(404).json({ message: 'İlan bulunamadı' });
    }
    
    // Sadece satıcı kendi ilanını güncelleyebilir
    if (listing.seller.toLowerCase() !== req.user.toLowerCase()) {
      return res.status(403).json({ message: 'Bu işlem için yetkiniz yok' });
    }
    
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    
    res.json(updatedListing);
  } catch (err) {
    console.error('İlan güncellenirken hata:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// İlan sil
router.delete('/:id', auth, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    
    if (!listing) {
      return res.status(404).json({ message: 'İlan bulunamadı' });
    }
    
    // Sadece satıcı kendi ilanını silebilir
    if (listing.seller.toLowerCase() !== req.user.toLowerCase()) {
      return res.status(403).json({ message: 'Bu işlem için yetkiniz yok' });
    }
    
    await Listing.findByIdAndDelete(req.params.id);
    res.json({ message: 'İlan başarıyla silindi' });
  } catch (err) {
    console.error('İlan silinirken hata:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

module.exports = router; 