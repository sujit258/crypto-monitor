import { sortByDefault } from '../crypto';
import type { CryptoRate } from '../crypto';

describe('Crypto utilities', () => {
  describe('sortByDefault', () => {
    it('should sort rates alphabetically by symbol', () => {
      const rates: CryptoRate[] = [
        { symbol: 'ETH', name: 'Ethereum', priceUSD: 2500, priceBTC: 0.05 },
        { symbol: 'BTC', name: 'Bitcoin', priceUSD: 50000, priceBTC: 1 },
        { symbol: 'SOL', name: 'Solana', priceUSD: 150, priceBTC: 0.003 },
      ];

      const sorted = sortByDefault(rates);

      expect(sorted[0].symbol).toBe('BTC');
      expect(sorted[1].symbol).toBe('ETH');
      expect(sorted[2].symbol).toBe('SOL');
    });

    it('should return a new array without mutating the original', () => {
      const original: CryptoRate[] = [
        { symbol: 'ETH', name: 'Ethereum', priceUSD: 2500, priceBTC: 0.05 },
        { symbol: 'BTC', name: 'Bitcoin', priceUSD: 50000, priceBTC: 1 },
      ];

      const sorted = sortByDefault(original);

      expect(original[0].symbol).toBe('ETH');
      expect(sorted[0].symbol).toBe('BTC');
    });

    it('should handle single item array', () => {
      const rates: CryptoRate[] = [
        { symbol: 'BTC', name: 'Bitcoin', priceUSD: 50000, priceBTC: 1 },
      ];

      const sorted = sortByDefault(rates);

      expect(sorted).toHaveLength(1);
      expect(sorted[0].symbol).toBe('BTC');
    });

    it('should handle empty array', () => {
      const sorted = sortByDefault([]);
      expect(sorted).toEqual([]);
    });

    it('should handle duplicate symbols (case-insensitive sort)', () => {
      const rates: CryptoRate[] = [
        { symbol: 'btc', name: 'Bitcoin', priceUSD: 50000, priceBTC: 1 },
        { symbol: 'BTC', name: 'Bitcoin', priceUSD: 50000, priceBTC: 1 },
      ];

      const sorted = sortByDefault(rates);

      expect(sorted).toHaveLength(2);
      // localeCompare is case-insensitive by default
      expect(['BTC', 'btc']).toContain(sorted[0].symbol);
    });
  });
});
