const request = require('supertest');
const express = require('express');
const { getTopCryptos, getHistory7d } = require('../../src/controllers/crypto.controller');
const coingecko = require('../../src/services/coingecko.service');
const history = require('../../src/services/history.service');

// Mock the services
jest.mock('../../src/services/coingecko.service');
jest.mock('../../src/services/history.service');

const mockedCoingecko = coingecko;
const mockedHistory = history;

// Create test app
const app = express();
app.use(express.json());
app.get('/api/crypto/top', getTopCryptos);
app.get('/api/crypto/:id/history', getHistory7d);

// Error handling middleware
app.use((err, req, res) => {
  res.status(500).json({ error: err.message });
});

describe('Crypto Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/crypto/top', () => {
    it('should return top cryptocurrencies successfully', async () => {
      const mockCryptos = [
        {
          id: 'bitcoin',
          name: 'Bitcoin',
          image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
          price: 65000,
          market_cap: 1280000000000,
          price_change: 1500,
          price_change_percentage: 2.35,
          trend: 'Hausse',
          ts: 1634112000000
        },
        {
          id: 'ethereum',
          name: 'Ethereum',
          image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
          price: 3500,
          market_cap: 420000000000,
          price_change: -50,
          price_change_percentage: -1.41,
          trend: 'Baisse',
          ts: 1634112000000
        }
      ];

      mockedCoingecko.getTop10WithTrend.mockResolvedValue(mockCryptos);

      const response = await request(app)
        .get('/api/crypto/top')
        .expect(200);

      expect(response.body).toEqual(mockCryptos);
      expect(mockedCoingecko.getTop10WithTrend).toHaveBeenCalledTimes(1);
    });

    it('should handle service errors', async () => {
      const errorMessage = 'CoinGecko API error';
      mockedCoingecko.getTop10WithTrend.mockRejectedValue(new Error(errorMessage));

      const response = await request(app)
        .get('/api/crypto/top')
        .expect(500);

      expect(response.body).toEqual({ error: errorMessage });
    });

    it('should return empty array when no data', async () => {
      mockedCoingecko.getTop10WithTrend.mockResolvedValue([]);

      const response = await request(app)
        .get('/api/crypto/top')
        .expect(200);

      expect(response.body).toEqual([]);
    });
  });

  describe('GET /api/crypto/:id/history', () => {
    it('should return 7-day history for a cryptocurrency', async () => {
      const mockHistory = {
        prices: [
          [1634025600000, 60000],
          [1634112000000, 61000],
          [1634198400000, 62000]
        ],
        market_caps: [
          [1634025600000, 1120000000000],
          [1634112000000, 1140000000000],
          [1634198400000, 1160000000000]
        ],
        total_volumes: [
          [1634025600000, 25000000000],
          [1634112000000, 27000000000],
          [1634198400000, 29000000000]
        ]
      };

      mockedHistory.getHistory.mockResolvedValue(mockHistory);

      const response = await request(app)
        .get('/api/crypto/bitcoin/history')
        .expect(200);

      expect(response.body).toEqual(mockHistory);
      expect(mockedHistory.getHistory).toHaveBeenCalledWith('bitcoin', 7);
    });

    it('should convert coin ID to lowercase', async () => {
      const mockHistory = { prices: [], market_caps: [], total_volumes: [] };
      mockedHistory.getHistory.mockResolvedValue(mockHistory);

      await request(app)
        .get('/api/crypto/BITCOIN/history')
        .expect(200);

      expect(mockedHistory.getHistory).toHaveBeenCalledWith('bitcoin', 7);
    });

    it('should handle service errors for history', async () => {
      const errorMessage = 'History service error';
      mockedHistory.getHistory.mockRejectedValue(new Error(errorMessage));

      const response = await request(app)
        .get('/api/crypto/bitcoin/history')
        .expect(500);

      expect(response.body).toEqual({ error: errorMessage });
    });

    it('should handle invalid coin IDs', async () => {
      const errorMessage = 'Coin not found';
      mockedHistory.getHistory.mockRejectedValue(new Error(errorMessage));

      const response = await request(app)
        .get('/api/crypto/invalid-coin/history')
        .expect(500);

      expect(response.body).toEqual({ error: errorMessage });
      expect(mockedHistory.getHistory).toHaveBeenCalledWith('invalid-coin', 7);
    });

    it('should handle special characters in coin ID', async () => {
      const mockHistory = { prices: [], market_caps: [], total_volumes: [] };
      mockedHistory.getHistory.mockResolvedValue(mockHistory);

      await request(app)
        .get('/api/crypto/usd-coin/history')
        .expect(200);

      expect(mockedHistory.getHistory).toHaveBeenCalledWith('usd-coin', 7);
    });
  });

  describe('Error Handling', () => {
    it('should handle network timeouts', async () => {
      const timeoutError = new Error('Network timeout');
      mockedCoingecko.getTop10WithTrend.mockRejectedValue(timeoutError);

      const response = await request(app)
        .get('/api/crypto/top')
        .expect(500);

      expect(response.body).toEqual({ error: 'Network timeout' });
    });

    it('should handle malformed responses', async () => {
      const malformedError = new Error('Invalid JSON response');
      mockedHistory.getHistory.mockRejectedValue(malformedError);

      const response = await request(app)
        .get('/api/crypto/bitcoin/history')
        .expect(500);

      expect(response.body).toEqual({ error: 'Invalid JSON response' });
    });
  });
});
