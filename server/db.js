const mongoose = require('mongoose');

// Daha güvenilir bağlantı fonksiyonu
const connectDB = async () => {
  // Eğer URI yoksa başarılı simülasyon döndür
  if (!process.env.MONGODB_URI) {
    console.warn('MONGODB_URI bulunamadı - simüle edilmiş bağlantı dönüyor');
    return { connection: { host: 'simulated-connection' } };
  }
  
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });
    
    console.log(`MongoDB bağlantısı başarılı: ${conn.connection.host}`);
    
    // Test connection
    const dbStatus = mongoose.connection.readyState;
    console.log('Veritabanı Durumu:', 
      ['Bağlantı yok', 'Bağlanıyor', 'Bağlandı', 'Bağlantı kesiliyor'][dbStatus]);
    
    return conn;
  } catch (error) {
    console.error('MongoDB bağlantı hatası:', error.message);
    // Hata durumunda null döndür ama hata fırlatma
    return null;
  }
};

module.exports = connectDB;
