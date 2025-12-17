# Crypto Dashboard

A real-time cryptocurrency price tracker built with React Router(Remix), React, and Tailwind CSS. Displays live prices from Coinbase API with drag-and-drop reordering, search filtering, dark mode, and responsive design.

## Features

- **Real-time Prices**: Fetches 12 cryptocurrencies (BTC, ETH, SOL, ADA, DOT, AVAX, MATIC, XRP, DOGE, LTC, LINK, UNI)
- **Dual Price Display**: Shows USD and BTC conversion rates
- **Drag & Drop**: Reorder cards by dragging - order persists in localStorage
- **Search Filter**: Filter cryptos by name or symbol (case-insensitive)
- **Dark/Light Mode**: Toggle theme with persistence
- **Manual Refresh**: Click refresh button to update all prices
- **Skeleton Loading**: Shows skeleton UI while data fetches
- **Responsive Design**: Works on mobile, tablet, and desktop

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**
```bash
# Copy the example env file
cp .env.example .env.local
```
See `.env.example` for all available configuration options. Currently uses CoinGecko API (free, no authentication required).

3. **Start the development server:**
```bash
npm run dev
```

3. **Open in browser:**
- Navigate to `http://localhost:5174` (or the port shown in terminal)
- HMR (Hot Module Reload) is enabled - changes auto-refresh

4. **Build for production:**
```bash
npm run build
```

5. **Start production server:**
```bash
npm run start
```

## Project Structure

```
app/
├── routes/
│   └── index.tsx               # Main dashboard component
├── components/
│   ├── Header.tsx              # Header with search, sort, theme toggle
│   ├── CryptoCard.tsx          # Draggable card component
│   ├── SkeletonCard.tsx        # Loading skeleton UI
│   └── __tests__/              # Component tests
├── lib/
│   ├── config.ts               # Environment configuration
│   ├── crypto.ts               # CoinGecko API integration
│   ├── utils.ts                # Color generation utilities
│   └── __tests__/              # Library tests
├── root.tsx                    # Root layout & theme management
├── routes.ts                   # Route configuration
└── app.css                     # Tailwind directives
