// Validation utility functions

// Get list of valid forests from the service
import { FOREST_BBOXES } from "../services/sentinelHubService.js";

/**
 * Validate date format (YYYY-MM-DD)
 */
export function isValidDate(dateString) {
  if (!dateString || typeof dateString !== 'string') {
    return false;
  }
  
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateString)) {
    return false;
  }
  
  const date = new Date(dateString);
  const today = new Date();
  
  // Check if date is valid and not in the future
  if (isNaN(date.getTime())) {
    return false;
  }
  
  // Date should not be in the future
  if (date > today) {
    return false;
  }
  
  // Date should not be too old (Sentinel-2 started in 2015)
  const minDate = new Date('2015-06-23');
  if (date < minDate) {
    return false;
  }
  
  return true;
}

/**
 * Validate forest name
 */
export function isValidForest(forestName) {
  if (!forestName || typeof forestName !== 'string') {
    return false;
  }
  return Object.keys(FOREST_BBOXES).includes(forestName);
}

/**
 * Get list of valid forests
 */
export function getValidForests() {
  return Object.keys(FOREST_BBOXES);
}

/**
 * Validate URL format
 */
export function isValidUrl(urlString) {
  if (!urlString || typeof urlString !== 'string') {
    return false;
  }
  
  try {
    const url = new URL(urlString);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Validate GIBS image request
 */
export function validateGibsRequest(req, res, next) {
  const { forest, date } = req.query;
  const errors = [];

  // Check if forest is provided
  if (!forest) {
    errors.push("'forest' query parameter is required");
  } else if (!isValidForest(forest)) {
    errors.push(`'forest' must be one of: ${getValidForests().join(', ')}`);
  }

  // Check if date is provided
  if (!date) {
    errors.push("'date' query parameter is required (format: YYYY-MM-DD)");
  } else if (!isValidDate(date)) {
    errors.push("'date' must be in YYYY-MM-DD format, not in the future, and not before 2015-06-23 (Sentinel-2 launch date)");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: "Validation failed",
      details: errors
    });
  }

  next();
}

/**
 * Validate comparison request
 */
export function validateCompareRequest(req, res, next) {
  const { beforeUrl, afterUrl, forest, beforeDate, afterDate } = req.body;
  const errors = [];

  // Must provide either URLs or forest+dates
  const hasUrls = beforeUrl && afterUrl;
  const hasForestDates = forest && beforeDate && afterDate;

  if (!hasUrls && !hasForestDates) {
    errors.push("Either provide (beforeUrl, afterUrl) OR (forest, beforeDate, afterDate)");
  }

  // Validate URLs if provided
  if (hasUrls) {
    if (!isValidUrl(beforeUrl)) {
      errors.push("'beforeUrl' must be a valid HTTP/HTTPS URL");
    }
    if (!isValidUrl(afterUrl)) {
      errors.push("'afterUrl' must be a valid HTTP/HTTPS URL");
    }
  }

  // Validate forest and dates if provided
  if (hasForestDates) {
    if (!isValidForest(forest)) {
      errors.push(`'forest' must be one of: ${getValidForests().join(', ')}`);
    }
    if (!isValidDate(beforeDate)) {
      errors.push("'beforeDate' must be in YYYY-MM-DD format, not in the future, and not before 2015-06-23");
    }
    if (!isValidDate(afterDate)) {
      errors.push("'afterDate' must be in YYYY-MM-DD format, not in the future, and not before 2015-06-23");
    }
    
    // Check that afterDate is after beforeDate
    if (isValidDate(beforeDate) && isValidDate(afterDate)) {
      const before = new Date(beforeDate);
      const after = new Date(afterDate);
      if (after <= before) {
        errors.push("'afterDate' must be after 'beforeDate'");
      }
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: "Validation failed",
      details: errors
    });
  }

  next();
}