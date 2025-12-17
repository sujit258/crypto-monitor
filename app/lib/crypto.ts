export interface CryptoRate {
  symbol: string;
  name: string;
  priceUSD: number;
  priceBTC: number;
}

export interface CryptoData {
  rates: CryptoRate[];
  fetchedAt: string;
}

export type SortType = 'name' | 'price-asc' | 'price-desc' | 'default';

import { getApiBaseUrl } from './config';

const API_BASE_URL = getApiBaseUrl();

const CRYPTO_ASSETS = [
  { symbol: 'BTC', name: 'Bitcoin', id: 'bitcoin' },
  { symbol: 'ETH', name: 'Ethereum', id: 'ethereum' },
  { symbol: 'SOL', name: 'Solana', id: 'solana' },
  { symbol: 'ADA', name: 'Cardano', id: 'cardano' },
  { symbol: 'DOT', name: 'Polkadot', id: 'polkadot' },
  { symbol: 'AVAX', name: 'Avalanche', id: 'avalanche-2' },
  { symbol: 'MATIC', name: 'Polygon', id: 'matic-network' },
  { symbol: 'XRP', name: 'Ripple', id: 'ripple' },
  { symbol: 'DOGE', name: 'Dogecoin', id: 'dogecoin' },
  { symbol: 'LTC', name: 'Litecoin', id: 'litecoin' },
  { symbol: 'LINK', name: 'Chainlink', id: 'chainlink' },
  { symbol: 'UNI', name: 'Uniswap', id: 'uniswap' },
];


export async function fetchCryptoRates(): Promise<CryptoRate[]> {
  try {
    // Build comma-separated list of crypto IDs for batch request
    const cryptoIds = CRYPTO_ASSETS.map((asset) => asset.id).join(',');
    const url = `${API_BASE_URL}/simple/price?ids=${cryptoIds}&vs_currencies=usd`;
    
    console.log('Fetching from:', url);

    // Single API call for all cryptocurrencies - much more efficient!
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`API Response Error: ${response.status} ${response.statusText}`);
      throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as Record<string, { usd: number }>;
    console.log('API Response:', data);

    // Get BTC price for conversion
    const btcPrice = data.bitcoin?.usd;
    if (!btcPrice || btcPrice === 0) {
      throw new Error('Unable to fetch BTC price');
    }

    // Transform API response to CryptoRate format
    const rates: CryptoRate[] = CRYPTO_ASSETS
      .map((asset) => {
        const priceUSD = data[asset.id]?.usd;
        if (!priceUSD || priceUSD === 0) {
          return null;
        }

        return {
          symbol: asset.symbol,
          name: asset.name,
          priceUSD,
          priceBTC: priceUSD / btcPrice,
        };
      })
      .filter((rate): rate is CryptoRate => rate !== null);

    if (rates.length === 0) {
      throw new Error('No rates could be fetched');
    }

    return rates;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('Error fetching crypto rates:', errorMsg);
    throw new Error(`Failed to fetch cryptocurrency rates: ${errorMsg}`);
  }
}

export function sortByDefault(rates: CryptoRate[]): CryptoRate[] {
  return [...rates]; // Preserve original order (for drag-and-drop)
}

export function sortByName(rates: CryptoRate[]): CryptoRate[] {
  return [...rates].sort((a, b) => a.name.localeCompare(b.name));
}

export function sortByPrice(rates: CryptoRate[], ascending: boolean = false): CryptoRate[] {
  return [...rates].sort((a, b) => {
    const diff = a.priceUSD - b.priceUSD;
    return ascending ? diff : -diff;
  });
}
