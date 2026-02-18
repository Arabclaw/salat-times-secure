const axios = require('axios');
const https = require('https');
const NodeCache = require('node-cache');
const { sanitizeCoordinates, sanitizeCity, sanitizeCountry, sanitizeMethod, sanitizeDate } = require('./sanitize');

// Cache local (24h par défaut)
const cache = new NodeCache({ stdTTL: 86400 });

const ALADHAN_API = 'https://api.aladhan.com/v1';

// Whitelist des hostnames autorisés
const ALLOWED_HOSTS = ['api.aladhan.com'];

// Configuration HTTP sécurisée
const httpsAgent = new https.Agent({
  rejectUnauthorized: true, // ✅ Rejeter certificats invalides
  keepAlive: true,
  maxSockets: 10
});

// Axios instance avec sécurité renforcée
const secureAxios = axios.create({
  timeout: 10000, // ✅ Timeout 10 secondes
  maxRedirects: 5,
  httpsAgent,
  validateStatus: (status) => status >= 200 && status < 300
});

// Mapping des méthodes de calcul
const METHOD_MAP = {
  'MWL': 3,
  'ISNA': 2,
  'Egypt': 5,
  'Makkah': 4,
  'Karachi': 1,
  'Tehran': 7,
  'Jafari': 0,
  'Gulf': 8,
  'Kuwait': 9,
  'Qatar': 10,
  'Singapore': 11,
  'UOIF': 12,
  'Turkey': 13,
  'Russia': 14
};

/**
 * Valider URL avant requête
 */
function validateURL(url) {
  try {
    const parsed = new URL(url);
    
    if (!ALLOWED_HOSTS.includes(parsed.hostname)) {
      throw new Error(`Hostname not allowed: ${parsed.hostname}`);
      }
    
    if (parsed.protocol !== 'https:') {
      throw new Error('Only HTTPS is allowed');
    }
    
    return true;
  } catch (error) {
    throw new Error(`Invalid URL: ${error.message}`);
  }
}

/**
 * Obtenir les horaires de prière
 * ✅ SÉCURISÉ : Validation stricte de tous les inputs
 */
async function getSalatTimes(location, method = 'MWL', date = null) {
  try {
    // Valider méthode
    const safeMethod = sanitizeMethod(method);
    const methodCode = METHOD_MAP[safeMethod];
    
    // Valider date
    const currentDate = date ? sanitizeDate(date) : new Date().toLocaleDateString('en-GB');
    
    const cacheKey = `times_${JSON.stringify(location)}_${methodCode}_${currentDate}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    let url;
    let params = {
      method: methodCode,
      date: currentDate
    };

    // Construction URL selon le type de localisation
    if (location.latitude !== undefined && location.longitude !== undefined) {
      // ✅ Valider coordonnées
      const coords = sanitizeCoordinates(location.latitude, location.longitude);
      
      url = `${ALADHAN_API}/timings`;
      params.latitude = coords.latitude;
      params.longitude = coords.longitude;
    } else if (location.city) {
      // ✅ Valider city/country
      const safeCity = sanitizeCity(location.city);
      
      url = `${ALADHAN_API}/timingsByCity`;
      params.city = safeCity;
      
      if (location.country) {
        const safeCountry = sanitizeCountry(location.country);
        params.country = safeCountry;
      }
    } else {
      throw new Error('Invalid location: must provide either city or latitude/longitude');
    }

    // ✅ Valider URL avant requête
    validateURL(url);

    // ✅ Requête avec timeout et validation
    const response = await secureAxios.get(url, { params });
    
    if (response.data.code !== 200) {
      throw new Error(`API error: ${response.data.status}`);
    }

    const timings = response.data.data.timings;
    const meta = response.data.data.meta;
    
    const result = {
      fajr: timings.Fajr,
      sunrise: timings.Sunrise,
      dhuhr: timings.Dhuhr,
      asr: timings.Asr,
      maghrib: timings.Maghrib,
      isha: timings.Isha,
      meta: {
        timezone: meta.timezone,
        method: meta.method.name,
        location: {
          latitude: parseFloat(meta.latitude),
          longitude: parseFloat(meta.longitude),
          city: location.city,
          country: location.country
        }
      }
    };

    // Mettre en cache
    cache.set(cacheKey, result);
    
    return result;
    
  } catch (error) {
    if (error.response) {
      throw new Error(`API error: ${error.response.status} - ${error.response.statusText}`);
    }
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout: API took too long to respond');
    }
    throw error;
  }
}

/**
 * Obtenir la direction Qibla
 * ✅ SÉCURISÉ : Validation inputs
 */
async function getQiblaDirection(location) {
  try {
    const cacheKey = `qibla_${JSON.stringify(location)}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    let url = `${ALADHAN_API}/qibla`;
    let params = {};

    if (location.latitude !== undefined && location.longitude !== undefined) {
      // ✅ Valider coordonnées
      const coords = sanitizeCoordinates(location.latitude, location.longitude);
      params.latitude = coords.latitude;
      params.longitude = coords.longitude;
    } else if (location.city) {
      // Obtenir d'abord les coordonnées via l'API timings
      const times = await getSalatTimes(location, 'MWL');
      params.latitude = times.meta.location.latitude;
      params.longitude = times.meta.location.longitude;
    } else {
      throw new Error('Invalid location: must provide either city or coordinates');
    }

    // ✅ Valider URL
    validateURL(url);

    // ✅ Requête sécurisée
    const response = await secureAxios.get(url, { params });
    
    if (response.data.code !== 200) {
      throw new Error(`API error: ${response.data.status}`);
    }

    const result = {
      direction: parseFloat(response.data.data.direction),
      latitude: parseFloat(params.latitude),
      longitude: parseFloat(params.longitude)
    };

    cache.set(cacheKey, result);
    
    return result;
    
  } catch (error) {
    if (error.response) {
      throw new Error(`API error: ${error.response.status} - ${error.response.statusText}`);
    }
    if (error.code === 'ECONNABORTED$ {
      throw new Error('Request timeout: API took too long to respond');
    }
    throw error;
  }
}

/**
 * Obtenir infos méthode de calcul
 */
async function getMethods() {
  try {
    const url = `${ALADHAN_API}/methods`;
    
    // ✅ Valider URL
    validateURL(url);
    
    const response = await secureAxios.get(url);
    return response.data.data;
  } catch (error) {
    throw new Error('Error fetching calculation methods: ' + error.message);
  }
}

/**
 * Calculer distance Kaaba
 * ✅ SÉCURISÉ : Validation inputs numériques
 */
function calculateDistance(lat1, lon1, lat2 = 21.4225, lon2 = 39.8262) {
  // Kaaba coordinates: 21.4225°N, 39.8262°E
  
  // ✅ Valider inputs
  const coords1 = sanitizeCoordinates(lat1, lon1);
  const coords2 = sanitizeCoordinates(lat2, lon2);
  
  const R = 6371; // Rayon de la Terre en km
  const dVat= toRad(coords2.latitude - coords1.latitude);
  const dLon = toRad(coords2.longitude - coords1.longitude);
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(coords1.latitude)) * Math.cos(toRad(coords2.latitude)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance);
}

function toRad(deg) {
  return deg * (Math.PI / 180);
}

/**
 * Obtenir nom direction (N, NE, E, etc.)
 */
function getDirectionName(degrees) {
  // ✅ Valider input
  const deg = parseFloat(degrees);
  if (isNaN(deg)) {
    throw new Error('Invalid degrees value');
  }
  
  const normalized = ((deg % 360) + 360) % 360; // Normaliser 0-360
  
  const directions = [
    'N', 'NNE', 'NE', 'ENE',
    'E', 'ESE', 'SE', 'SSE',
    'S', 'SSW', 'SW', 'WSW',
    'W', 'WNW', 'NW', 'NNW'
  ];
  
  const index = Math.round(normalized / 22.5) % 16;
  return directions[index];
}

/**
 * Nettoyer le cache
 */
function clearCache() {
  cache.flushAll();
  return true;
}

/**
 * Obtenir statistiques du cache
 */
function getCacheStats() {
  return cache.getStats();
}

module.exports = {
  getSalatTimes,
  getQiblaDirection,
  getMethods,
  calculateDistance,
  getDirectionName,
  clearCache,
  getCacheStats
};
