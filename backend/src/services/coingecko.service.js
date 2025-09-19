const axios = require('axios');

const baseURL = process.env.COINGECKO_BASE_URL || 'https://api.coingecko.com/api/v3';

async function getTop10WithTrend() {
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

  return data.map(x => ({
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
}

async function getMarketChart(coinId, days = 7) {
  // /coins/{id}/market_chart?vs_currency=usd&days=7
  const { data } = await axios.get(`${baseURL}/coins/${coinId}/market_chart`, {
    params: { vs_currency: 'usd', days },
    timeout: 15000
  });
  return data;
}

module.exports = { getTop10WithTrend, getMarketChart };
