const request = require('supertest');
const app = require('../../src/app');

// Mock external dependencies
jest.mock('../../src/services/coingecko.service');
jest.mock('../../src/services/history.service');

const coingecko = require('../../src/services/coingecko.service');
const history = require('../../src/services/history.service');

describe('API Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Health Check', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app)
        .get('/api/unknown')
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Crypto API Endpoints', () => {
    beforeEach(() => {
      // Mock the service functions
      coingecko.getTop10WithTrend.mockResolvedValue([
        {
          id: 'bitcoin',
          name: 'Bitcoin',
          image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
          price: 50000,
          market_cap: 1000000000,
          price_change: 1000,
          price_change_percentage: 2.5,
          trend: 'Hausse',
          ts: Date.now()
        }
      ]);

      history.getHistory.mockResolvedValue({
        prices: [[1633024800000, 50000]],
        market_caps: [[1633024800000, 1000000000]],
        total_volumes: [[1633024800000, 50000000]]
      });
    });

    it('should get top cryptocurrencies with complete data structure', async () => {
      const response = await request(app)
        .get('/api/cryptos')
        .expect(200);

      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('name');
      expect(response.body[0]).toHaveProperty('price');
      expect(response.body[0]).toHaveProperty('trend');
      expect(response.body[0]).toHaveProperty('ts');
    });

    it('should get historical data for a specific cryptocurrency', async () => {
      const response = await request(app)
        .get('/api/history/bitcoin')
        .expect(200);
      expect(response.body).toHaveProperty('prices');
      expect(response.body).toHaveProperty('market_caps');
      expect(response.body).toHaveProperty('total_volumes');
    });
  });

  describe('Error Handling Integration', () => {
    it('should handle service errors gracefully', async () => {
      coingecko.getTop10WithTrend.mockRejectedValue(new Error('API Rate Limit Exceeded'));

      const response = await request(app)
        .get('/api/cryptos')
        .expect(500);

      expect(response.body).toHaveProperty('error');
    });

    it('should handle malformed requests', async () => {
      const response = await request(app)
        .post('/api/cryptos')
        .send({ invalid: 'data' })
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Middleware Integration', () => {
    it('should include security headers', async () => {
      const response = await request(app)
        .get('/api/cryptos')
        .expect(200);

      // Check for helmet security headers
      expect(response.headers).toHaveProperty('x-content-type-options');
      expect(response.headers).toHaveProperty('x-frame-options');
    });

    it('should handle JSON parsing errors', async () => {
      const response = await request(app)
        .post('/api/cryptos')
        .set('Content-Type', 'application/json')
        .send('invalid json')
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('API Performance', () => {
    it('should respond within reasonable time limits', async () => {
      const startTime = Date.now();
      await request(app)
        .get('/api/cryptos')
        .expect(200);
      const endTime = Date.now();

      const responseTime = endTime - startTime;
      expect(responseTime).toBeLessThan(1000); // Should respond within 1 second
    });
  });
});
