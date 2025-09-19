const redisService = require('./redis.service');
const logger = require('../config/logger');

class CacheService {
  constructor() {
    this.defaultTTL = 300; // 5 minutes par défaut
    this.cacheKeys = {
      TOP_CRYPTOS: 'crypto:top10',
      CRYPTO_HISTORY: 'crypto:history:',
      MARKET_CHART: 'crypto:chart:'
    };
  }

  // Cache pour les top 10 cryptos
  async getTopCryptos() {
    try {
      const cached = await redisService.get(this.cacheKeys.TOP_CRYPTOS);
      if (cached) {
        logger.info('Cache HIT: Top cryptos retrieved from cache');
        return cached;
      }
      logger.info('Cache MISS: Top cryptos not found in cache');
      return null;
    } catch (error) {
      logger.error('Cache error getting top cryptos:', error);
      return null;
    }
  }

  async setTopCryptos(data, ttl = this.defaultTTL) {
    try {
      await redisService.set(this.cacheKeys.TOP_CRYPTOS, data, ttl);
      logger.info('Cache SET: Top cryptos cached successfully');
      return true;
    } catch (error) {
      logger.error('Cache error setting top cryptos:', error);
      return false;
    }
  }

  // Cache pour l'historique des cryptos
  async getCryptoHistory(coinId, days = 7) {
    try {
      const key = `${this.cacheKeys.CRYPTO_HISTORY}${coinId}:${days}d`;
      const cached = await redisService.get(key);
      if (cached) {
        logger.info(`Cache HIT: History for ${coinId} (${days}d) retrieved from cache`);
        return cached;
      }
      logger.info(`Cache MISS: History for ${coinId} (${days}d) not found in cache`);
      return null;
    } catch (error) {
      logger.error(`Cache error getting history for ${coinId}:`, error);
      return null;
    }
  }

  async setCryptoHistory(coinId, days = 7, data, ttl = this.defaultTTL) {
    try {
      const key = `${this.cacheKeys.CRYPTO_HISTORY}${coinId}:${days}d`;
      await redisService.set(key, data, ttl);
      logger.info(`Cache SET: History for ${coinId} (${days}d) cached successfully`);
      return true;
    } catch (error) {
      logger.error(`Cache error setting history for ${coinId}:`, error);
      return false;
    }
  }

  // Cache pour les graphiques de marché
  async getMarketChart(coinId, days = 7) {
    try {
      const key = `${this.cacheKeys.MARKET_CHART}${coinId}:${days}d`;
      const cached = await redisService.get(key);
      if (cached) {
        logger.info(`Cache HIT: Market chart for ${coinId} (${days}d) retrieved from cache`);
        return cached;
      }
      logger.info(`Cache MISS: Market chart for ${coinId} (${days}d) not found in cache`);
      return null;
    } catch (error) {
      logger.error(`Cache error getting market chart for ${coinId}:`, error);
      return null;
    }
  }

  async setMarketChart(coinId, days = 7, data, ttl = this.defaultTTL) {
    try {
      const key = `${this.cacheKeys.MARKET_CHART}${coinId}:${days}d`;
      await redisService.set(key, data, ttl);
      logger.info(`Cache SET: Market chart for ${coinId} (${days}d) cached successfully`);
      return true;
    } catch (error) {
      logger.error(`Cache error setting market chart for ${coinId}:`, error);
      return false;
    }
  }

  // Invalidation du cache
  async invalidateTopCryptos() {
    try {
      await redisService.del(this.cacheKeys.TOP_CRYPTOS);
      logger.info('Cache INVALIDATED: Top cryptos cache cleared');
      return true;
    } catch (error) {
      logger.error('Cache error invalidating top cryptos:', error);
      return false;
    }
  }

  async invalidateCryptoHistory(coinId, days = 7) {
    try {
      const key = `${this.cacheKeys.CRYPTO_HISTORY}${coinId}:${days}d`;
      await redisService.del(key);
      logger.info(`Cache INVALIDATED: History for ${coinId} (${days}d) cleared`);
      return true;
    } catch (error) {
      logger.error(`Cache error invalidating history for ${coinId}:`, error);
      return false;
    }
  }

  // Clear all cache
  async clearAll() {
    try {
      await redisService.flush();
      logger.info('Cache CLEARED: All cache data removed');
      return true;
    } catch (error) {
      logger.error('Cache error clearing all data:', error);
      return false;
    }
  }

  // Health check
  isHealthy() {
    return redisService.isHealthy();
  }

  // Get cache stats
  async getStats() {
    try {
      const topCryptosExists = await redisService.exists(this.cacheKeys.TOP_CRYPTOS);
      return {
        healthy: this.isHealthy(),
        topCryptosCached: topCryptosExists,
        cacheKeys: this.cacheKeys
      };
    } catch (error) {
      logger.error('Cache error getting stats:', error);
      return {
        healthy: false,
        error: error.message
      };
    }
  }
}

module.exports = new CacheService();
