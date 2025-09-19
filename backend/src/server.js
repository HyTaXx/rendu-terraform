const http = require('http');
const app = require('./app');
const logger = require('./config/logger');
const { initCosmos } = require('./services/cosmos.service');
const { startScheduler, stopScheduler } = require('./jobs/scheduler');

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

(async () => {
  try {
    await initCosmos();      // connexion Cosmos, création DB/container si besoin
    startScheduler();        // démarre les crons
    server.listen(PORT, () => logger.info(`API listening on :${PORT}`));
  } catch (err) {
    logger.error({ err }, 'Startup failed');
    process.exit(1);
  }
})();

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

function shutdown() {
  stopScheduler();
  server.close(() => process.exit(0));
}
