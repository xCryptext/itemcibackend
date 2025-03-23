// Express app'i import et
const app = require('../server');

// Tamamen bağımsız API handler
module.exports = (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // OPTIONS request için erken yanıt
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Temel rota kontrolü
  if (req.url === '/api/health' || req.url === '/api/health/') {
    return res.status(200).json({
      status: 'success',
      message: 'Health check passed',
      timestamp: new Date().toISOString()
    });
  }
  
  // Varsayılan yanıt
  res.status(200).json({
    success: true,
    message: 'API endpoint active',
    endpoint: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });
}; 