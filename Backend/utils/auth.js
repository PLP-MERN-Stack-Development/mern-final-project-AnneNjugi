// Simple API key authentication for admin endpoints

const ADMIN_API_KEY = process.env.ADMIN_API_KEY || 'default-admin-key-change-in-production';

/**
 * Middleware to authenticate admin requests
 */
export function authenticateAdmin(req, res, next) {
  const apiKey = req.headers['x-api-key'] || req.query.apiKey;

  if (!apiKey) {
    return res.status(401).json({
      error: 'Authentication required',
      message: 'Please provide an API key in x-api-key header or apiKey query parameter'
    });
  }

  if (apiKey !== ADMIN_API_KEY) {
    return res.status(403).json({
      error: 'Invalid API key',
      message: 'The provided API key is not valid'
    });
  }

  next();
}