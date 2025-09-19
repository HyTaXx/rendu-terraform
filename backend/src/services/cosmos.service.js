const { CosmosClient } = require('@azure/cosmos');
const logger = require('../config/logger');

let client, database, container;

async function initCosmos() {
  client = new CosmosClient({
    endpoint: process.env.COSMOS_ENDPOINT,
    key: process.env.COSMOS_KEY
  });

  const { database: db } = await client.databases.createIfNotExists({ id: process.env.COSMOS_DB });
  database = db;

  const { container: cont } = await database.containers.createIfNotExists({
    id: process.env.COSMOS_CONTAINER,
    partitionKey: { paths: [process.env.COSMOS_PARTITION_KEY || '/symbol'] }
  });

  container = cont;
  logger.info('Cosmos connected');
}

function getContainer() { return container; }

module.exports = { initCosmos, getContainer };
