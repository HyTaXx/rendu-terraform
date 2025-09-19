const { getContainer } = require('./cosmos.service');
const { priceDoc } = require('../models/price.model');
const coingecko = require('./coingecko.service');
const cacheService = require('./cache.service');
const logger = require('../config/logger');

async function storeSnapshot(list) {
  const container = getContainer();
  const ops = list.map(item => ({ operationType: 'Create', resourceBody: priceDoc(item) }));
  if (ops.length) await container.items.bulk(ops);
}

async function getHistory(coinId, days = 7) {
  // Essayer de récupérer depuis le cache d'abord
  const cached = await cacheService.getCryptoHistory(coinId, days);
  if (cached) {
    return cached;
  }

  const container = getContainer();
  const ms = 86400000 * days;
  const since = Date.now() - ms;

  const query = {
    query: 'SELECT c.coinId, c.name, c.price, c.change24h, c.ts FROM c WHERE c.coinId = @id AND c.ts >= @since ORDER BY c.ts ASC',
    parameters: [
      { name: '@id', value: coinId },
      { name: '@since', value: since }
    ]
  };

  try {
    const { resources } = await container.items.query(query).fetchAll();

    if (resources.length > 0) {
      // Sauvegarder en cache pour 10 minutes
      await cacheService.setCryptoHistory(coinId, days, resources, 600);
      return resources;
    }

    // Fallback first run: fetch from API (requires mapping coinId->id)
    logger.info(`No history found in DB for ${coinId}, fetching from API`);
    const chart = await coingecko.getMarketChart(coinId, days);
    const fallbackData = chart.prices.map(([ts, price]) => ({ coinId, price, ts }));
    
    // Sauvegarder en cache pour 5 minutes (données de fallback)
    await cacheService.setCryptoHistory(coinId, days, fallbackData, 300);
    
    return fallbackData;
  } catch (error) {
    logger.error(`Error fetching history for ${coinId}:`, error);
    throw error;
  }
}

module.exports = { storeSnapshot, getHistory };
