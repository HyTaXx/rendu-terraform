require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const routes = require('./routes');
const { notFound } = require('./middlewares/notfound.middleware');
const { errorHandler } = require('./middlewares/error.middleware');
const logger = require('./config/logger');

const app = express();
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
