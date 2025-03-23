// Basit mock API endpoint
module.exports = (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // OPTIONS request için erken yanıt
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Sabit örnek resimler döndür
  const demoImageUrls = [
    'https://via.placeholder.com/800x600?text=Demo+Image+1',
    'https://via.placeholder.com/800x600?text=Demo+Image+2'
  ];
  
  res.status(200).json({
    success: true,
    message: 'Demo resimler kullanıldı',
    imageUrls: demoImageUrls
  });
}; 