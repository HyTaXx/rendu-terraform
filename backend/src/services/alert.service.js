const logger = require('../config/logger');
const THRESH = Number(process.env.ALERT_THRESHOLD_24H || -5);

function shouldAlert(change24h) {
  return change24h <= THRESH;
}

async function sendAlert({ coinId, name, change24h }) {
  // Brancher ici: email (SMTP), Teams webhook, etc.
  logger.warn(`ALERTE: ${coinId} (${name}) variation 24h = ${change24h.toFixed(2)}%`);
}

module.exports = { shouldAlert, sendAlert };
