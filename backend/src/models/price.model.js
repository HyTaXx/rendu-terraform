// Simple shape for Cosmos (SQL API)
function priceDoc({ id, name, price, change24h, ts }) {
  return {
    id: `${symbol}-${ts}`,
    coinId: id,
    name,
    price,
    change24h,
    ts
  };
}

module.exports = { priceDoc };
