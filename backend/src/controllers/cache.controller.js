const cacheService = require('../services/cache.service');
const logger = require('../config/logger');

// Get cache statistics
exports.getCacheStats = async (req, res, next) => {
  try {
    const stats = await cacheService.getStats();
    res.json({
      status: 'success',
      data: stats
    });
  } catch (error) {
    logger.error('Error getting cache stats:', error);
    next(error);
  }
};

// Clear specific cache entries
exports.clearCache = async (req, res, next) => {
  try {
    const { type, coinId, days } = req.body;

    let result = false;
    let message = '';

    switch (type) {
      case 'top_cryptos':
        result = await cacheService.invalidateTopCryptos();
        message = 'Top cryptos cache cleared';
        break;
      
      case 'crypto_history':
        if (!coinId) {
          return res.status(400).json({
            status: 'error',
            message: 'coinId is required for crypto_history cache clear'
          });
        }
        result = await cacheService.invalidateCryptoHistory(coinId, days || 7);
        message = `History cache cleared for ${coinId} (${days || 7}d)`;
        break;
      
      case 'all':
        result = await cacheService.clearAll();
        message = 'All cache cleared';
        break;
      
      default:
        return res.status(400).json({
          status: 'error',
          message: 'Invalid cache type. Use: top_cryptos, crypto_history, or all'
        });
    }

    if (result) {
      logger.info(message);
      res.json({
        status: 'success',
        message
      });
    } else {
      res.status(500).json({
        status: 'error',
        message: 'Failed to clear cache'
      });
    }
  } catch (error) {
    logger.error('Error clearing cache:', error);
    next(error);
  }
};

// Warm up cache (prefetch data)
exports.warmUpCache = async (req, res, next) => {
  try {
    const coingecko = require('../services/coingecko.service');
    
    // Prefetch top cryptos
    logger.info('Warming up cache with top cryptos');
    await coingecko.getTop10WithTrend();
    
    res.json({
      status: 'success',
      message: 'Cache warmed up successfully'
    });
  } catch (error) {
    logger.error('Error warming up cache:', error);
    next(error);
  }
};
