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
## Design Decisions & Tradeoffs

### Scope vs. Polish
**Decision**: Focused on core features (data fetching, filtering, drag-and-drop, persistence) with minimal animations.

**Tradeoff**: 
- ✅ All requirements delivered on time
- ❌ UI is functional, not flashy

---

### API Call Strategy
**Decision**: Single batch API call (`?ids=bitcoin,ethereum,...`) instead of 12 individual requests.

**Tradeoff**:
- ✅ 3-4x faster (300ms vs 1.5s)
- ✅ No rate-limiting risk

---

### Data Fetching with Remix Loader
**Decision**: Used loader pattern for initial data fetch instead of client-side useEffect.

**Tradeoff**:
- ✅ Data ready before component mounts (no waterfall)
- ✅ Single source of truth
- ❌ No built-in auto-refresh (manual refresh only)

---

### State Management: useState vs Context
**Decision**: Simple `useState` in root component instead of React Context API or Redux.

**What we used:**
- `useState` for: rates, searchTerm, sortType, isDark, isRefreshing, etc.

**Tradeoff**:
- ✅ Simple, readable, no boilerplate
- ❌ Not scalable if app grows to 50+ components

---

### Persistence Layer
**Decision**: localStorage for card order + theme, no backend.

**Tradeoff**:
- ✅ No auth/server needed
- ✅ Fast, instant persistence
- ❌ Limited to 5-10MB, user can clear it

---

### Drag-and-Drop Library
**Decision**: `@dnd-kit` over React-Beautiful-DnD or custom solution.

**Tradeoff**:
- ✅ Modern, actively maintained, lightweight (14kb)
- ✅ Accessibility first
- ❌ Requires more setup than alternatives

---

### Component Memoization
**Decision**: Selective `memo()` on CryptoCard + `useMemo()` for color calculations.

**Tradeoff**:
- ✅ Prevents unnecessary re-renders (12 cards)
- ❌ Added complexity vs naive approach

---

### Styling: Tailwind CSS
**Decision**: Utility-first Tailwind instead of CSS Modules or Styled-Components.

**Tradeoff**:
- ✅ Smallest bundle, fastest dev speed
- ✅ Built-in dark mode support
- ❌ Long className strings

---

### Development Time
**Total**: ~4-5 hours
- Setup & Architecture: 30~40 min
- Core Features: 90 min
- UI & Styling: 60~70 min
- Testing: 30 min
- Docs & Polish: 40 min
