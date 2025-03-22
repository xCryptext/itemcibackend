// Bu basit bir auth middleware örneğidir
// Gerçek uygulamada Ethereum imzası veya JWT kullanabilirsiniz

const auth = (req, res, next) => {
  // Bu örnek sadece Ethereum adresinin header'da olup olmadığını kontrol eder
  const ethAddress = req.headers['x-eth-address'];
  
  if (!ethAddress) {
    return res.status(401).json({ error: 'Yetkilendirme hatası, cüzdan bağlantısı gerekli' });
  }

  // Kullanıcı bilgisini request'e ekle
  req.user = { address: ethAddress };
  next();
};

module.exports = auth; 