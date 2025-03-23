const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'İlan başlığı zorunludur'],
    trim: true,
    maxlength: [100, 'Başlık en fazla 100 karakter olabilir']
  },
  description: {
    type: String,
    required: [true, 'İlan açıklaması zorunludur'],
    trim: true,
    maxlength: [2000, 'Açıklama en fazla 2000 karakter olabilir']
  },
  price: {
    type: Number,
    required: [true, 'Fiyat bilgisi zorunludur'],
    min: [0, 'Fiyat 0 veya daha büyük olmalıdır']
  },
  cryptoCurrency: {
    type: String,
    required: [true, 'Kripto para birimi zorunludur'],
    enum: ['ETH', 'DAI', 'USDT'],
    default: 'ETH'
  },
  images: {
    type: [String],
    default: []
  },
  seller: {
    type: String,
    required: [true, 'Satıcı adresi zorunludur'],
    lowercase: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'sold', 'cancelled'],
    default: 'active'
  },
  dealId: {
    type: String,
    default: null
  },
  buyer: {
    type: String,
    default: null,
    lowercase: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Satıcı ve alıcı için indeks oluştur
ListingSchema.index({ seller: 1 });
ListingSchema.index({ buyer: 1 });
ListingSchema.index({ status: 1 });

const Listing = mongoose.model('Listing', ListingSchema);

module.exports = Listing; 