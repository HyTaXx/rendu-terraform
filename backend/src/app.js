require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const routes = require('./routes');
const { notFound } = require('./middlewares/notfound.middleware');
const { errorHandler } = require('./middlewares/error.middleware');
const redisService = require('./services/redis.service');
const logger = require('./config/logger');

const app = express();
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));

// Initialize Redis connection
redisService.connect().then((connected) => {
  if (connected) {
    logger.info('Redis cache service initialized successfully');
  } else {
    logger.warn('Redis cache service failed to initialize - running without cache');
  }
}).catch((error) => {
  logger.error('Redis initialization error:', error);
});

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
