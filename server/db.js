const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log(`MongoDB Bağlantısı Başarılı: ${conn.connection.host}`);
    
    // Test connection
    const dbStatus = mongoose.connection.readyState;
    console.log('Veritabanı Durumu:', 
      ['Bağlantı yok', 'Bağlanıyor', 'Bağlandı', 'Bağlantı kesiliyor'][dbStatus]);
    
    return conn;
  } catch (error) {
    console.error(`Hata: ${error.message}`);
    return null;
  }
};

module.exports = connectDB;
