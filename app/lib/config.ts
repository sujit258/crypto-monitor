// Configuration module that works in both browser and test environments
export function getApiBaseUrl(): string {
  // Try import.meta.env first (browser environment)
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_COINGECKO_API_URL) {
    return import.meta.env.VITE_COINGECKO_API_URL;
  }
  
  // Fallback to process.env (Node.js/test environment)
  if (typeof process !== 'undefined' && process.env?.VITE_COINGECKO_API_URL) {
    return process.env.VITE_COINGECKO_API_URL;
  }
  
  // Default to CoinGecko
  return 'https://api.coingecko.com/api/v3';
}

export function getApiTimeout(): number {
  const timeout = 
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_TIMEOUT) ||
    (typeof process !== 'undefined' && process.env?.VITE_API_TIMEOUT) ||
    '10000';
  return parseInt(String(timeout), 10);
}
