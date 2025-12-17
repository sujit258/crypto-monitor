import { useCallback } from 'react';
import type { SortType } from '~/lib/crypto';

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  sortType: SortType;
  onSortChange: (type: SortType) => void;
  visibleCount: number;
  totalCount: number;
  isRefreshing: boolean;
  onRefresh: () => void;
  isDark: boolean;
  onThemeToggle: () => void;
  currentTime: string;
}

export function Header({
  searchTerm,
  onSearchChange,
  sortType,
  onSortChange,
  visibleCount,
  totalCount,
  isRefreshing,
  onRefresh,
  isDark,
  onThemeToggle,
  currentTime,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/70 dark:bg-slate-950/70 border-b border-slate-200/60 dark:border-slate-800/60 support-[backdrop-filter]:bg-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

          {/* Title & Badge */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg text-white shadow-lg shadow-blue-500/30">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                CryptoMonitor
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium tracking-wide uppercase">
                Live Market Data
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 flex-1 w-full">
            {/* Search bar */}
            <div className="relative group flex-1 md:flex-none md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl leading-5 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 text-sm shadow-sm"
                placeholder="Search coins..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>

            {/* Sort dropdown */}
            <select
              value={sortType}
              onChange={(e) => onSortChange(e.target.value as SortType)}
              className="px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 shadow-sm"
              title="Sort cryptocurrencies"
            >
              <option value="default">Sort by Symbol</option>
              <option value="name">Sort by Name</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>

            <div className="flex items-center border-l border-slate-200 dark:border-slate-800 pl-3 gap-2 md:ml-auto">
              <button
                onClick={onRefresh}
                disabled={isRefreshing}
                className="p-2 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors relative"
                title="Refresh Rates"
              >
                <svg className={`w-5 h-5 ${isRefreshing ? 'animate-spin text-blue-500' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>

              <button
                onClick={onThemeToggle}
                className="p-2 text-slate-500 hover:text-orange-500 dark:text-slate-400 dark:hover:text-yellow-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDark ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <div className="mt-4 flex flex-wrap items-center justify-between text-xs sm:text-sm text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/50 pt-3">
          <div className="flex items-center gap-4">
            <span>Displaying <span className="font-semibold text-slate-700 dark:text-slate-200">{visibleCount}</span> assets</span>
            {searchTerm && (
              <button
                onClick={() => onSearchChange('')}
                className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear filter
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <div>
            <span className="hidden sm:inline">Updated: <span className="font-mono text-xs">{currentTime}</span></span>
          </div>
        </div>
      </div>
    </header>
  );
}
