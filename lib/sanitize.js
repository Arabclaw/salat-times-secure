const validator = require('validator');

/**
 * Sanitize geographic coordinates
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {object} Validated coordinates
 */
function sanitizeCoordinates(lat, lon) {
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lon);
  
  if (isNaN(latitude) || isNaN(longitude)) {
    throw new Error('Coordinates must be valid numbers');
  }
  
  if (latitude < -90 || latitude > 90) {
    throw new Error('Latitude must be between -90 and 90');
  }
  
  if (longitude < -180 || longitude > 180) {
    throw new Error('Longitude must be between -180 and 180');
  }
  
  return { latitude, longitude };
}

/**
 * Sanitize city name
 * @param {string} city - City name
 * @returns {string} Sanitized city name
 */
function sanitizeCity(city) {
  if (!city || typeof city !== 'string') {
    throw new Error('Invalid city name');
  }
  
  // Whitelist: letters (including accents), spaces, hyphens, apostrophes
  if (!/^[a-zA-ZÀ-ÿ\s\-']+$/.test(city)) {
    throw new Error('City name contains invalid characters');
  }
  
  if (city.length > 100) {
    throw new Error('City name is too long (max 100 characters)');
  }
  
  return validator.escape(city.trim());
}

/**
 * Sanitize country name
 * @param {string} country - Country name
 * @returns {string} Sanitized country name
 */
function sanitizeCountry(country) {
  if (!country || typeof country !== 'string') {
    throw new Error('Invalid country name');
  }
  
  // Whitelist: letters and spaces only
  if (!/^[a-zA-Z\s]+$/.test(country)) {
    throw new Error('Country name contains invalid characters');
  }
  
  if (country.length > 100) {
    throw new Error('Country name is too long (max 100 characters)');
  }
  
  return validator.escape(country.trim());
}

/**
 * Valid calculation methods (whitelist)
 */
const VALID_METHODS = [
  'MWL', 'ISNA', 'Egypt', 'Makkah', 'Karachi',
  'Tehran', 'Jafari', 'Gulf', 'Kuwait', 'Qatar',
  'Singapore', 'UOIF', 'Turkey', 'Russia'
];

/**
 * Sanitize calculation method
 * @param {string} method - Calculation method
 * @returns {string} Validated method
 */
function sanitizeMethod(method) {
  if (!VALID_METHODS.includes(method)) {
    throw new Error(`Invalid calculation method. Must be one of: ${VALID_METHODS.join(', ')}`);
  }
  return method;
}

/**
 * Valid languages (whitelist)
 */
const VALID_LANGUAGES = ['ar', 'fr', 'en'];

/**
 * Sanitize language code
 * @param {string} lang - Language code
 * @returns {string} Validated language
 */
function sanitizeLanguage(lang) {
  if (!VALID_LANGUAGES.includes(lang)) {
    throw new Error(`Invalid language. Must be one of: ${VALID_LANGUAGES.join(', ')}`);
  }
  return lang;
}

/**
 * Sanitize phone number
 * @param {string} phone - Phone number
 * @returns {string} Validated phone number
 */
function sanitizePhoneNumber(phone) {
  if (!phone || typeof phone !== 'string') {
    throw new Error('Invalid phone number');
  }
  
  // Must start with +
  if (!phone.startsWith('+')) {
    throw new Error('Phone number must start with + (international format)');
  }
  
  // Validate using validator
  if (!validator.isMobilePhone(phone, 'any', { strictMode: true })) {
    throw new Error('Invalid phone number format');
  }
  
  return phone;
}

/**
 * Sanitize username (Telegram, etc.)
 * @param {string} username - Username
 * @returns {string} Validated username
 */
function sanitizeUsername(username) {
  if (!username || typeof username !== 'string') {
    throw new Error('Invalid username');
  }
  
  // Must start with @
  if (!username.startsWith('@')) {
    throw new Error('Username must start with @');
  }
  
  // Only alphanumeric and underscore after @
  if (!/^@[a-zA-Z0-9_]+$/.test(username)) {
    throw new Error('Username contains invalid characters');
  }
  
  if (username.length > 33) { // @ + 32 chars max
    throw new Error('Username is too long (max 32 characters)');
  }
  
  return username;
}

/**
 * Sanitize recipient (phone or username)
 * @param {string} recipient - Recipient identifier
 * @returns {string} Validated recipient
 */
function sanitizeRecipient(recipient) {
  if (!recipient || typeof recipient !== 'string') {
    throw new Error('Invalid recipient');
  }
  
  if (recipient.startsWith('+')) {
    return sanitizePhoneNumber(recipient);
  } else if (recipient.startsWith('@')) {
    return sanitizeUsername(recipient);
  } else {
    throw new Error('Recipient must be a phone number (+...) or username (@...)');
  }
}

/**
 * Sanitize message content
 * @param {string} message - Message text
 * @returns {string} Validated message
 */
function sanitizeMessage(message) {
  if (!message || typeof message !== 'string') {
    throw new Error('Invalid message');
  }
  
  if (message.length > 4096) { // Telegram/WhatsApp limit
    throw new Error('Message is too long (max 4096 characters)');
  }
  
  // Basic sanitization (escape potential control characters)
  return message.replace(/[\x00-\x1F\x7F]/g, ''); // Remove control chars
}

/**
 * Sanitize time string (HH:mm format)
 * @param {string} time - Time string
 * @returns {string} Validated time
 */
function sanitizeTime(time) {
  if (!time || typeof time !== 'string') {
    throw new Error('Invalid time');
  }
  
  // Must match HH:mm format
  if (!/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
    throw new Error('Time must be in HH:mm format (00:00 to 23:59)');
  }
  
  return time;
}

/**
 * Sanitize date string (DD-MM-YYYY format)
 * @param {string} date - Date string
 * @returns {string} Validated date
 */
function sanitizeDate(date) {
  if (!date || typeof date !== 'string') {
    throw new Error('Invalid date');
  }
  
  // Must match DD-MM-YYYY format
  if (!/^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/.test(date)) {
    throw new Error('Date must be in DD-MM-YYYY format');
  }
  
  return date;
}

/**
 * Sanitize integer value
 * @param {*} value - Value to sanitize
 * @param {number} min - Minimum allowed value
 * @param {number} max - Maximum allowed value
 * @returns {number} Validated integer
 */
function sanitizeInteger(value, min = -Infinity, max = Infinity) {
  const num = parseInt(value, 10);
  
  if (isNaN(num)) {
    throw new Error('Value must be a valid integer');
  }
  
  if (num < min || num > max) {
    throw new Error(`Value must be between ${min} and ${max}`);
  }
  
  return num;
}

module.exports = {
  sanitizeCoordinates,
  sanitizeCity,
  sanitizeCountry,
  sanitizeMethod,
  sanitizeLanguage,
  sanitizePhoneNumber,
  sanitizeUsername,
  sanitizeRecipient,
  sanitizeMessage,
  sanitizeTime,
  sanitizeDate,
  sanitizeInteger,
  VALID_METHODS,
  VALID_LANGUAGES
};
