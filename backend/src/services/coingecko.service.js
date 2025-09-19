const axios = require('axios');
const cacheService = require('./cache.service');
const logger = require('../config/logger');

const baseURL = process.env.COINGECKO_BASE_URL || 'https://api.coingecko.com/api/v3';

async function getTop10WithTrend() {
  // Essayer de récupérer depuis le cache d'abord
  const cached = await cacheService.getTopCryptos();
  if (cached) {
    return cached;
  }

  try {
    logger.info('Fetching top 10 cryptos from CoinGecko API');
    // markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&price_change_percentage=24h
    const { data } = await axios.get(`${baseURL}/coins/markets`, {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 10,
        page: 1,
        price_change_percentage: '24h'
      },
      timeout: 15000
    });

    const transformedData = data.map(x => ({
      id: x.id,
      name: x.name,
      image: x.image,
      price: x.current_price,
      market_cap: x.market_cap,
      price_change: x.price_change,
      price_change_percentage: x.price_change_percentage_24h,
      trend: x.price_change_percentage_24h >= 0 ? 'Hausse' : 'Baisse',
      ts: Date.now()
    }));

    // Sauvegarder en cache pour 5 minutes
    await cacheService.setTopCryptos(transformedData, 300);

    return transformedData;
  } catch (error) {
    logger.error('Error fetching top 10 cryptos:', error);
    throw error;
  }
}

async function getMarketChart(coinId, days = 7) {
  // Essayer de récupérer depuis le cache d'abord
  const cached = await cacheService.getMarketChart(coinId, days);
  if (cached) {
    return cached;
  }

  try {
    logger.info(`Fetching market chart for ${coinId} (${days}d) from CoinGecko API`);
    // /coins/{id}/market_chart?vs_currency=usd&days=7
    const { data } = await axios.get(`${baseURL}/coins/${coinId}/market_chart`, {
      params: { vs_currency: 'usd', days },
      timeout: 15000
    });

    // Sauvegarder en cache pour 10 minutes
    await cacheService.setMarketChart(coinId, days, data, 600);

    return data;
  } catch (error) {
    logger.error(`Error fetching market chart for ${coinId}:`, error);
    throw error;
  }
}

module.exports = { getTop10WithTrend, getMarketChart };
