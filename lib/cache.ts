import { createClient } from 'redis';

// Redis client configuration
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

let redisClient: any = null;

// Initialize Redis client
export async function getRedisClient() {
  if (!redisClient) {
    try {
      redisClient = createClient({
        url: redisUrl,
        socket: {
          connectTimeout: 5000,
        },
      });

      redisClient.on('error', (err: any) => {
        console.error('Redis Client Error:', err);
      });

      redisClient.on('connect', () => {
        console.log('Redis Client Connected');
      });

      await redisClient.connect();
    } catch (error) {
      console.error('Failed to connect to Redis:', error);
      redisClient = null;
    }
  }
  return redisClient;
}

// Cache interface
export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  prefix?: string;
}

// Default cache settings
const DEFAULT_TTL = 3600; // 1 hour
const DEFAULT_PREFIX = 'realestate:';

// Generate cache key
function generateCacheKey(key: string, prefix: string = DEFAULT_PREFIX): string {
  return `${prefix}${key}`;
}

// Set cache value
export async function setCache(
  key: string,
  value: any,
  options: CacheOptions = {}
): Promise<boolean> {
  try {
    const client = await getRedisClient();
    if (!client) return false;

    const cacheKey = generateCacheKey(key, options.prefix);
    const ttl = options.ttl || DEFAULT_TTL;
    const serializedValue = JSON.stringify(value);

    await client.setEx(cacheKey, ttl, serializedValue);
    return true;
  } catch (error) {
    console.error('Cache set error:', error);
    return false;
  }
}

// Get cache value
export async function getCache<T = any>(
  key: string,
  options: CacheOptions = {}
): Promise<T | null> {
  try {
    const client = await getRedisClient();
    if (!client) return null;

    const cacheKey = generateCacheKey(key, options.prefix);
    const cachedValue = await client.get(cacheKey);

    if (cachedValue) {
      return JSON.parse(cachedValue) as T;
    }
    return null;
  } catch (error) {
    console.error('Cache get error:', error);
    return null;
  }
}

// Delete cache value
export async function deleteCache(
  key: string,
  options: CacheOptions = {}
): Promise<boolean> {
  try {
    const client = await getRedisClient();
    if (!client) return false;

    const cacheKey = generateCacheKey(key, options.prefix);
    await client.del(cacheKey);
    return true;
  } catch (error) {
    console.error('Cache delete error:', error);
    return false;
  }
}

// Delete multiple cache keys by pattern
export async function deleteCachePattern(
  pattern: string,
  options: CacheOptions = {}
): Promise<boolean> {
  try {
    const client = await getRedisClient();
    if (!client) return false;

    const cachePattern = generateCacheKey(pattern, options.prefix);
    const keys = await client.keys(cachePattern);

    if (keys.length > 0) {
      await client.del(keys);
    }
    return true;
  } catch (error) {
    console.error('Cache pattern delete error:', error);
    return false;
  }
}

// Cache with fallback function
export async function cacheWithFallback<T>(
  key: string,
  fallbackFn: () => Promise<T>,
  options: CacheOptions = {}
): Promise<T> {
  try {
    // Try to get from cache first
    const cachedValue = await getCache<T>(key, options);
    if (cachedValue !== null) {
      return cachedValue;
    }

    // If not in cache, execute fallback function
    const freshValue = await fallbackFn();

    // Store in cache for next time
    await setCache(key, freshValue, options);

    return freshValue;
  } catch (error) {
    console.error('Cache with fallback error:', error);
    // If cache fails, just return the fresh value
    return await fallbackFn();
  }
}

// Specific cache utilities for common use cases
export const propertyCache = {
  // Cache property details
  getProperty: (propertyId: string) =>
    getCache(`property:${propertyId}`, { ttl: 1800 }), // 30 minutes

  setProperty: (propertyId: string, property: any) =>
    setCache(`property:${propertyId}`, property, { ttl: 1800 }),

  deleteProperty: (propertyId: string) =>
    deleteCache(`property:${propertyId}`),

  // Cache property search results
  getSearchResults: (searchKey: string) =>
    getCache(`search:${searchKey}`, { ttl: 600 }), // 10 minutes

  setSearchResults: (searchKey: string, results: any) =>
    setCache(`search:${searchKey}`, results, { ttl: 600 }),

  // Cache featured properties
  getFeaturedProperties: () =>
    getCache('featured:properties', { ttl: 3600 }), // 1 hour

  setFeaturedProperties: (properties: any) =>
    setCache('featured:properties', properties, { ttl: 3600 }),

  // Clear all property-related cache
  clearPropertyCache: () =>
    deleteCachePattern('property:*'),
};

export const userCache = {
  // Cache user profile
  getUser: (userId: string) =>
    getCache(`user:${userId}`, { ttl: 1800 }),

  setUser: (userId: string, user: any) =>
    setCache(`user:${userId}`, user, { ttl: 1800 }),

  deleteUser: (userId: string) =>
    deleteCache(`user:${userId}`),

  // Cache user notifications count
  getNotificationCount: (userId: string) =>
    getCache(`notifications:count:${userId}`, { ttl: 300 }), // 5 minutes

  setNotificationCount: (userId: string, count: number) =>
    setCache(`notifications:count:${userId}`, count, { ttl: 300 }),
};

export const analyticsCache = {
  // Cache analytics data
  getAnalytics: (key: string) =>
    getCache(`analytics:${key}`, { ttl: 7200 }), // 2 hours

  setAnalytics: (key: string, data: any) =>
    setCache(`analytics:${key}`, data, { ttl: 7200 }),

  // Cache market data
  getMarketData: (location: string) =>
    getCache(`market:${location}`, { ttl: 86400 }), // 24 hours

  setMarketData: (location: string, data: any) =>
    setCache(`market:${location}`, data, { ttl: 86400 }),
};

// Cache warming utilities
export async function warmCache() {
  try {
    console.log('Starting cache warming...');

    // Warm featured properties cache
    // This would typically fetch from database and cache the results

    console.log('Cache warming completed');
  } catch (error) {
    console.error('Cache warming error:', error);
  }
}

// Cache health check
export async function checkCacheHealth(): Promise<boolean> {
  try {
    const client = await getRedisClient();
    if (!client) return false;

    await client.ping();
    return true;
  } catch (error) {
    console.error('Cache health check failed:', error);
    return false;
  }
}

// Graceful shutdown
export async function closeCacheConnection() {
  try {
    if (redisClient) {
      await redisClient.quit();
      redisClient = null;
    }
  } catch (error) {
    console.error('Error closing cache connection:', error);
  }
}
