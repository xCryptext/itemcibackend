const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing');

// Tüm ilanları getir
router.get('/', async (req, res) => {
  try {
    // Query parametrelerini al
    const { 
      keyword, 
      minPrice, 
      maxPrice, 
      status = 'active',
      seller,
      buyer,
      sortBy = 'createdAt', 
      sortOrder = 'desc',
      page = 1,
      limit = 10
    } = req.query;
    
    // Filtreleme için sorgu oluştur
    const query = {};
    
    // Keyword filtresi (başlık veya açıklama içinde)
    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } }
      ];
    }
    
    // Fiyat filtresi
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    
    // Durum filtresi
    if (status) {
      query.status = status;
    }
    
    // Satıcı filtresi
    if (seller) {
      query.seller = seller.toLowerCase();
    }
    
    // Alıcı filtresi
    if (buyer) {
      query.buyer = buyer.toLowerCase();
    }
    
    // Sıralama için sort objesi oluştur
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    
    // Sayfalama için hesaplamalar
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    // İlanları getir
    const listings = await Listing.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limitNum);
    
    // Toplam ilan sayısı
    const total = await Listing.countDocuments(query);
    
    // Yanıt döndür
    res.json({
      success: true,
      count: listings.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      listings
    });
  } catch (error) {
    console.error('İlanlar yüklenirken hata:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Yeni ilan oluştur
router.post('/', async (req, res) => {
  try {
    const { title, description, price, cryptoCurrency, images, seller } = req.body;
    
    // Zorunlu alanları kontrol et
    if (!title || !description || !price || !seller) {
      return res.status(400).json({ 
        success: false, 
        error: 'Başlık, açıklama, fiyat ve satıcı adresi zorunludur' 
      });
    }
    
    // Yeni ilan oluştur
    const listing = new Listing({
      title,
      description,
      price: Number(price),
      cryptoCurrency: cryptoCurrency || 'ETH',
      images,
      seller: seller.toLowerCase(),
      status: 'active'
    });
    
    // Veritabanına kaydet
    await listing.save();
    
    // Yanıt döndür
    res.status(201).json({
      success: true,
      listing
    });
  } catch (error) {
    console.error('İlan oluşturulurken hata:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Tekil ilan detayı getir
router.get('/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    
    if (!listing) {
      return res.status(404).json({ success: false, error: 'İlan bulunamadı' });
    }
    
    res.json({
      success: true,
      listing
    });
  } catch (error) {
    console.error('İlan detayı yüklenirken hata:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// İlan güncelle
router.put('/:id', async (req, res) => {
  try {
    const { title, description, price, status, buyer, dealId } = req.body;
    
    // İlanı bul
    let listing = await Listing.findById(req.params.id);
    
    if (!listing) {
      return res.status(404).json({ success: false, error: 'İlan bulunamadı' });
    }
    
    // Güncelleme bilgilerini hazırla
    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (price) updateData.price = Number(price);
    if (status) updateData.status = status;
    if (buyer) updateData.buyer = buyer.toLowerCase();
    if (dealId) updateData.dealId = dealId;
    
    // Güncelleme tarihini ayarla
    updateData.updatedAt = Date.now();
    
    // İlanı güncelle
    listing = await Listing.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      listing
    });
  } catch (error) {
    console.error('İlan güncellenirken hata:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// İlan sil
router.delete('/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    
    if (!listing) {
      return res.status(404).json({ success: false, error: 'İlan bulunamadı' });
    }
    
    await Listing.deleteOne({ _id: req.params.id });
    
    res.json({
      success: true,
      message: 'İlan başarıyla silindi'
    });
  } catch (error) {
    console.error('İlan silinirken hata:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router; 