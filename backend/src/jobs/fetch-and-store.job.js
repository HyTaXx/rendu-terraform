const coingecko = require('../services/coingecko.service');
const history = require('../services/history.service');
const { shouldAlert, sendAlert } = require('../services/alert.service');

async function run() {
  console.log('Job fetch-and-store started');
  const list = await coingecko.getTop10WithTrend();
  await history.storeSnapshot(list);

  // Détecter les chutes > seuil et alerter
  await Promise.all(list.map(async (x) => {
    if (shouldAlert(x.change24h)) await sendAlert({ coinId: x.id, name: x.name, change24h: x.change24h });
  }));
}

module.exports = { run };
