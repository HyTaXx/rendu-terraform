const { getContainer } = require('./cosmos.service');
const { priceDoc } = require('../models/price.model');
const coingecko = require('./coingecko.service');

async function storeSnapshot(list) {
  const container = getContainer();
  const ops = list.map(item => ({ operationType: 'Create', resourceBody: priceDoc(item) }));
  if (ops.length) await container.items.bulk(ops);
}

async function getHistory(coinId, days = 7) {
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

  const { resources } = await container.items.query(query).fetchAll();

  if (resources.length > 0) return resources;

  // Fallback first run: fetch from API (requires mapping coinId->id)
  const chart = await coingecko.getMarketChart(coinId, days);
  return chart.prices.map(([ts, price]) => ({ coinId, price, ts }));
}

module.exports = { storeSnapshot, getHistory };
