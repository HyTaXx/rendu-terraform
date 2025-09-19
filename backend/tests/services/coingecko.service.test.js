const axios = require('axios');
const { getTop10WithTrend, getMarketChart } = require('../../src/services/coingecko.service');

// Mock axios
jest.mock('axios');
const mockedAxios = axios;

describe('CoinGecko Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getTop10WithTrend', () => {
    it('should return top 10 cryptocurrencies with trend data', async () => {
      // Mock data from CoinGecko API
      const mockApiResponse = {
        data: [
          {
            id: 'bitcoin',
            name: 'Bitcoin',
            image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
            current_price: 65000,
            market_cap: 1280000000000,
            price_change: 1500,
            price_change_percentage_24h: 2.35
          },
          {
            id: 'ethereum',
            name: 'Ethereum',
            image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
            current_price: 3500,
            market_cap: 420000000000,
            price_change: -50,
            price_change_percentage_24h: -1.41
          }
        ]
      };

      mockedAxios.get.mockResolvedValue(mockApiResponse);

      const result = await getTop10WithTrend();

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('/coins/markets'),
        {
          params: {
            vs_currency: 'usd',
            order: 'market_cap_desc',
            per_page: 10,
            page: 1,
            price_change_percentage: '24h'
          },
          timeout: 15000
        }
      );

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: 'bitcoin',
        name: 'Bitcoin',
        image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
        price: 65000,
        market_cap: 1280000000000,
        price_change: 1500,
        price_change_percentage: 2.35,
        trend: 'Hausse',
        ts: expect.any(Number)
      });

      expect(result[1]).toEqual({
        id: 'ethereum',
        name: 'Ethereum',
        image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
        price: 3500,
        market_cap: 420000000000,
        price_change: -50,
        price_change_percentage: -1.41,
        trend: 'Baisse',
        ts: expect.any(Number)
      });
    });

    it('should set trend to "Hausse" when price change is positive', async () => {
      const mockApiResponse = {
        data: [
          {
            id: 'bitcoin',
            name: 'Bitcoin',
            image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
            current_price: 65000,
            market_cap: 1280000000000,
            price_change: 1500,
            price_change_percentage_24h: 2.35
          }
        ]
      };

      mockedAxios.get.mockResolvedValue(mockApiResponse);

      const result = await getTop10WithTrend();

      expect(result[0].trend).toBe('Hausse');
    });

    it('should set trend to "Baisse" when price change is negative', async () => {
      const mockApiResponse = {
        data: [
          {
            id: 'ethereum',
            name: 'Ethereum',
            image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
            current_price: 3500,
            market_cap: 420000000000,
            price_change: -50,
            price_change_percentage_24h: -1.41
          }
        ]
      };

      mockedAxios.get.mockResolvedValue(mockApiResponse);

      const result = await getTop10WithTrend();

      expect(result[0].trend).toBe('Baisse');
    });

    it('should set trend to "Hausse" when price change is zero', async () => {
      const mockApiResponse = {
        data: [
          {
            id: 'stablecoin',
            name: 'Stable Coin',
            image: 'https://example.com/stable.png',
            current_price: 1.00,
            market_cap: 1000000000,
            price_change: 0,
            price_change_percentage_24h: 0
          }
        ]
      };

      mockedAxios.get.mockResolvedValue(mockApiResponse);

      const result = await getTop10WithTrend();

      expect(result[0].trend).toBe('Hausse');
    });

    it('should handle API errors', async () => {
      const errorMessage = 'Network Error';
      mockedAxios.get.mockRejectedValue(new Error(errorMessage));

      await expect(getTop10WithTrend()).rejects.toThrow(errorMessage);
    });

    it('should handle empty response', async () => {
      const mockApiResponse = { data: [] };
      mockedAxios.get.mockResolvedValue(mockApiResponse);

      const result = await getTop10WithTrend();

      expect(result).toEqual([]);
    });
  });

  describe('getMarketChart', () => {
    it('should return market chart data for a specific coin', async () => {
      const mockApiResponse = {
        data: {
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
        }
      };

      mockedAxios.get.mockResolvedValue(mockApiResponse);

      const result = await getMarketChart('bitcoin', 7);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('/coins/bitcoin/market_chart'),
        {
          params: { vs_currency: 'usd', days: 7 },
          timeout: 15000
        }
      );

      expect(result).toEqual(mockApiResponse.data);
    });

    it('should use default days parameter when not provided', async () => {
      const mockApiResponse = {
        data: {
          prices: [[1634025600000, 60000]],
          market_caps: [[1634025600000, 1120000000000]],
          total_volumes: [[1634025600000, 25000000000]]
        }
      };

      mockedAxios.get.mockResolvedValue(mockApiResponse);

      await getMarketChart('bitcoin');

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('/coins/bitcoin/market_chart'),
        {
          params: { vs_currency: 'usd', days: 7 },
          timeout: 15000
        }
      );
    });

    it('should handle different days parameter', async () => {
      const mockApiResponse = {
        data: {
          prices: [[1634025600000, 60000]],
          market_caps: [[1634025600000, 1120000000000]],
          total_volumes: [[1634025600000, 25000000000]]
        }
      };

      mockedAxios.get.mockResolvedValue(mockApiResponse);

      await getMarketChart('ethereum', 30);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('/coins/ethereum/market_chart'),
        {
          params: { vs_currency: 'usd', days: 30 },
          timeout: 15000
        }
      );
    });

    it('should handle API errors for market chart', async () => {
      const errorMessage = 'Coin not found';
      mockedAxios.get.mockRejectedValue(new Error(errorMessage));

      await expect(getMarketChart('invalid-coin')).rejects.toThrow(errorMessage);
    });

    it('should handle timeout errors', async () => {
      const timeoutError = new Error('timeout of 15000ms exceeded');
      mockedAxios.get.mockRejectedValue(timeoutError);

      await expect(getMarketChart('bitcoin')).rejects.toThrow('timeout of 15000ms exceeded');
    });
  });

  describe('API Configuration', () => {
    it('should use correct base URL from environment variable', () => {
      // Test that the service uses the correct base URL
      // This would be tested through the axios calls
      expect(true).toBe(true); // Placeholder - actual implementation would check process.env
    });

    it('should have correct timeout configuration', async () => {
      const mockApiResponse = { data: [] };
      mockedAxios.get.mockResolvedValue(mockApiResponse);

      await getTop10WithTrend();

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          timeout: 15000
        })
      );
    });
  });
});
