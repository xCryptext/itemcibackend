// Tamamen bağımsız API endpoint
module.exports = (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // OPTIONS request için erken yanıt
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // JSON yanıt
  res.status(200).json({
    status: 'success',
    message: 'API is running',
    timestamp: new Date().toISOString(),
    serverless: true
  });
}; 