const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  address: {
    type: String,
    required: [true, 'Ethereum adresi zorunludur'],
    unique: true,
    lowercase: true,
    trim: true
  },
  nonce: {
    type: String,
    default: () => Math.floor(Math.random() * 1000000).toString()
  },
  username: {
    type: String,
    trim: true,
    maxlength: [50, 'Kullanıcı adı en fazla 50 karakter olabilir']
  },
  profileImage: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLoginAt: {
    type: Date,
    default: null
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = User; 