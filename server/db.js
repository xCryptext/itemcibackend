const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI ortam değişkeni ayarlanmamış!');
      return;
    }
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`MongoDB bağlantısı başarılı: ${conn.connection.host}`);
  } catch (err) {
    console.error(`MongoDB bağlantı hatası: ${err.message}`);
    // Serverless ortamda process.exit yapmayın
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
