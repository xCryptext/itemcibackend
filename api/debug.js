module.exports = (req, res) => {
  res.status(200).json({
    environment: process.env.NODE_ENV,
    serverTime: new Date().toISOString(),
    mongodb_uri_exists: process.env.MONGODB_URI ? 'Yes' : 'No',
    nodeVersion: process.version,
    platform: process.platform,
    vercelEnv: process.env.VERCEL_ENV || 'unknown',
    headers: req.headers
  });
}; 