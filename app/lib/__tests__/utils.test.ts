import { stringToColor, stringToTextColor } from '../utils';

describe('Color utilities', () => {
  describe('stringToColor', () => {
    it('should generate a consistent color for the same input', () => {
      const color1 = stringToColor('BTC');
      const color2 = stringToColor('BTC');
      expect(color1).toBe(color2);
    });

    it('should return a valid HSL color string', () => {
      const color = stringToColor('BTC');
      expect(color).toMatch(/^hsl\(\d+,\s*\d+%,\s*\d+%\)$/);
    });

    it('should generate different colors for different inputs', () => {
      const btcColor = stringToColor('BTC');
      const ethColor = stringToColor('ETH');
      expect(btcColor).not.toBe(ethColor);
    });

    it('should produce colors with saturation 70% and lightness 85%', () => {
      const color = stringToColor('BTC');
      expect(color).toMatch(/,\s*70%,\s*85%\)/);
    });
  });

  describe('stringToTextColor', () => {
    it('should generate a consistent text color for the same input', () => {
      const color1 = stringToTextColor('BTC');
      const color2 = stringToTextColor('BTC');
      expect(color1).toBe(color2);
    });

    it('should return a valid HSL color string', () => {
      const color = stringToTextColor('BTC');
      expect(color).toMatch(/^hsl\(\d+,\s*\d+%,\s*\d+%\)$/);
    });

    it('should produce colors with saturation 80% and lightness 30%', () => {
      const color = stringToTextColor('BTC');
      expect(color).toMatch(/,\s*80%,\s*30%\)/);
    });

    it('should generate different text colors for different inputs', () => {
      const btcColor = stringToTextColor('BTC');
      const ethColor = stringToTextColor('ETH');
      expect(btcColor).not.toBe(ethColor);
    });
  });
});
