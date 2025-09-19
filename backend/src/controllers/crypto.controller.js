const history = require('../services/history.service');
const coingecko = require('../services/coingecko.service');

exports.getTopCryptos = async (req, res, next) => {
  try {
    const list = await coingecko.getTop10WithTrend();
    res.json(list);
  } catch (e) { next(e); }
};

exports.getHistory7d = async (req, res, next) => {
  try {
    const coinId = req.params.id.toLowerCase();
    const data = await history.getHistory(coinId, 7);
    res.json(data);
  } catch (e) { next(e); }
};
