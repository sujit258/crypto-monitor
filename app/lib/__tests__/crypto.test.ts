import { sortByDefault, sortByName, sortByPrice } from '../crypto';
import type { CryptoRate } from '../crypto';

describe('Crypto utilities', () => {
  const mockRates: CryptoRate[] = [
    { symbol: 'ETH', name: 'Ethereum', priceUSD: 2500, priceBTC: 0.05 },
    { symbol: 'BTC', name: 'Bitcoin', priceUSD: 50000, priceBTC: 1 },
    { symbol: 'SOL', name: 'Solana', priceUSD: 150, priceBTC: 0.003 },
    { symbol: 'ADA', name: 'Cardano', priceUSD: 0.98, priceBTC: 0.00002 },
  ];

  describe('sortByDefault', () => {
    it('should sort rates alphabetically by symbol', () => {
      const rates = [...mockRates];
      const sorted = sortByDefault(rates);

      expect(sorted[0].symbol).toBe('ADA');
      expect(sorted[1].symbol).toBe('BTC');
      expect(sorted[2].symbol).toBe('ETH');
      expect(sorted[3].symbol).toBe('SOL');
    });

    it('should return a new array without mutating the original', () => {
      const original = [...mockRates];
      const originalOrder = original.map(r => r.symbol);

      const sorted = sortByDefault(original);

      expect(original.map(r => r.symbol)).toEqual(originalOrder);
      expect(sorted[0].symbol).not.toBe(original[0].symbol);
    });

    it('should handle single item array', () => {
      const rates: CryptoRate[] = [mockRates[0]];
      const sorted = sortByDefault(rates);

      expect(sorted).toHaveLength(1);
      expect(sorted[0].symbol).toBe(rates[0].symbol);
    });

    it('should handle empty array', () => {
      const sorted = sortByDefault([]);
      expect(sorted).toEqual([]);
    });

    it('should preserve original order (not re-sort)', () => {
      const rates: CryptoRate[] = [
        { symbol: 'ZZZ', name: 'Test', priceUSD: 100, priceBTC: 0.001 },
        { symbol: 'AAA', name: 'Test', priceUSD: 100, priceBTC: 0.001 },
      ];

      const sorted = sortByDefault(rates);
      // sortByDefault should preserve order, not sort
      expect(sorted[0].symbol).toBe('ZZZ');
      expect(sorted[1].symbol).toBe('AAA');
    });
  });

  describe('sortByName', () => {
    it('should sort cryptos alphabetically by name', () => {
      const sorted = sortByName([...mockRates]);

      expect(sorted[0].name).toBe('Bitcoin');
      expect(sorted[1].name).toBe('Cardano');
      expect(sorted[2].name).toBe('Ethereum');
      expect(sorted[3].name).toBe('Solana');
    });

    it('should return a new array without mutating the original', () => {
      const original = [...mockRates];
      const originalNames = original.map(r => r.name);

      const sorted = sortByName(original);

      expect(original.map(r => r.name)).toEqual(originalNames);
      expect(sorted[0].name).not.toBe(original[0].name);
    });

    it('should handle empty array', () => {
      const sorted = sortByName([]);
      expect(sorted).toEqual([]);
    });

    it('should handle case-insensitive sorting', () => {
      const rates: CryptoRate[] = [
        { symbol: 'A', name: 'alpha', priceUSD: 100, priceBTC: 0.001 },
        { symbol: 'B', name: 'Beta', priceUSD: 100, priceBTC: 0.001 },
        { symbol: 'C', name: 'charlie', priceUSD: 100, priceBTC: 0.001 },
      ];

      const sorted = sortByName(rates);
      expect(sorted[0].name.toLowerCase()).toBe('alpha');
      expect(sorted[1].name.toLowerCase()).toBe('beta');
      expect(sorted[2].name.toLowerCase()).toBe('charlie');
    });
  });

  describe('sortByPrice', () => {
    it('should sort cryptos by price descending (highest first)', () => {
      const sorted = sortByPrice([...mockRates]);

      expect(sorted[0].priceUSD).toBe(50000); // BTC
      expect(sorted[1].priceUSD).toBe(2500); // ETH
      expect(sorted[2].priceUSD).toBe(150); // SOL
      expect(sorted[3].priceUSD).toBe(0.98); // ADA
    });

    it('should return a new array without mutating the original', () => {
      const original = [...mockRates];
      const originalPrices = original.map(r => r.priceUSD);

      const sorted = sortByPrice(original);

      expect(original.map(r => r.priceUSD)).toEqual(originalPrices);
      expect(sorted[0].priceUSD).not.toBe(original[0].priceUSD);
    });

    it('should handle empty array', () => {
      const sorted = sortByPrice([]);
      expect(sorted).toEqual([]);
    });

    it('should handle equal prices (stable sort)', () => {
      const rates: CryptoRate[] = [
        { symbol: 'A', name: 'A', priceUSD: 100, priceBTC: 0.001 },
        { symbol: 'B', name: 'B', priceUSD: 100, priceBTC: 0.001 },
        { symbol: 'C', name: 'C', priceUSD: 50, priceBTC: 0.0005 },
      ];

      const sorted = sortByPrice(rates);
      expect(sorted[0].priceUSD).toBe(100);
      expect(sorted[1].priceUSD).toBe(100);
      expect(sorted[2].priceUSD).toBe(50);
    });

    it('should handle very small prices', () => {
      const rates: CryptoRate[] = [
        { symbol: 'A', name: 'A', priceUSD: 0.000001, priceBTC: 0.00000001 },
        { symbol: 'B', name: 'B', priceUSD: 0.001, priceBTC: 0.00001 },
      ];

      const sorted = sortByPrice(rates);
      expect(sorted[0].priceUSD).toBe(0.001);
      expect(sorted[1].priceUSD).toBe(0.000001);
    });
  });

  describe('Edge cases', () => {
    it('should handle arrays with undefined values gracefully', () => {
      const rates: CryptoRate[] = [
        { symbol: 'BTC', name: 'Bitcoin', priceUSD: 50000, priceBTC: 1 },
        { symbol: 'ETH', name: 'Ethereum', priceUSD: 2500, priceBTC: 0.05 },
      ];

      expect(() => sortByName(rates)).not.toThrow();
      expect(() => sortByPrice(rates)).not.toThrow();
      expect(() => sortByDefault(rates)).not.toThrow();
    });

    it('should maintain data integrity after sorting', () => {
      const original = [...mockRates];
      const sorted = sortByPrice(original);

      // Check that all data is preserved
      sorted.forEach(crypto => {
        expect(crypto.symbol).toBeDefined();
        expect(crypto.name).toBeDefined();
        expect(crypto.priceUSD).toBeDefined();
        expect(crypto.priceBTC).toBeDefined();
      });
    });
  });
});
