const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  cryptoCurrency: {
    type: String,
    required: true,
    enum: ['ETH', 'USDT', 'DAI'] // Desteklenen kripto paralar
  },
  seller: {
    type: String, // Satıcının Ethereum adresi
    required: true
  },
  images: [String],
  status: {
    type: String,
    enum: ['active', 'sold', 'cancelled'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Listing', ListingSchema); 