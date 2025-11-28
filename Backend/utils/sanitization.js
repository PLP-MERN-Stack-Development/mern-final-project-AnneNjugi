// Input sanitization utilities

/**
 * Sanitize string input by trimming and removing potentially harmful characters
 */
export function sanitizeString(input) {
  if (typeof input !== 'string') return '';

  return input
    .trim()
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .slice(0, 1000); // Limit length
}

/**
 * Sanitize email input
 */
export function sanitizeEmail(email) {
  if (typeof email !== 'string') return '';

  return email
    .trim()
    .toLowerCase()
    .replace(/[<>'"]/g, '') // Remove potentially harmful characters
    .slice(0, 254); // RFC 5321 limit
}

/**
 * Sanitize general input object
 */
export function sanitizeInput(input) {
  if (typeof input === 'string') {
    return sanitizeString(input);
  }

  if (typeof input === 'object' && input !== null) {
    const sanitized = {};
    for (const [key, value] of Object.entries(input)) {
      if (key.toLowerCase().includes('email')) {
        sanitized[key] = sanitizeEmail(value);
      } else {
        sanitized[key] = sanitizeString(value);
      }
    }
    return sanitized;
  }

  return input;
}

/**
 * Express middleware for input sanitization
 */
export function sanitizeMiddleware(req, res, next) {
  // Sanitize body
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeInput(req.body);
  }

  // Sanitize query parameters
  if (req.query && typeof req.query === 'object') {
    req.query = sanitizeInput(req.query);
  }

  // Sanitize route parameters
  if (req.params && typeof req.params === 'object') {
    req.params = sanitizeInput(req.params);
  }

  next();
}