const cron = require('node-cron');
const logger = require('../config/logger');
const fetchAndStore = require('./fetch-and-store.job');
// const alerting = require('./alerting.job');

let tasks = [];

function startScheduler() {
  // ex: toutes les heures
  tasks.push(cron.schedule('0 * * * *', safe(fetchAndStore.run)));

  tasks.forEach(t => t.start());
  logger.info('Scheduler started');
}

function stopScheduler() {
  tasks.forEach(t => t.stop());
  tasks = [];
}

function safe(fn) {
  return async () => {
    try { await fn(); } catch (e) { console.error(e); }
  };
}

module.exports = { startScheduler, stopScheduler };
