import { useState, useEffect, useMemo, useCallback } from 'react';
import { useLoaderData } from 'react-router';
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import type { Route } from './+types/index';
import { fetchCryptoRates, sortByDefault, sortByName, sortByPrice } from '~/lib/crypto';
import type { CryptoRate, SortType } from '~/lib/crypto';
import { CryptoCard } from '~/components/CryptoCard';
import { SkeletonCard } from '~/components/SkeletonCard';
import { Header } from '~/components/Header';


export async function loader(): Promise<{
  rates: CryptoRate[];
  fetchedAt: string;
}> {
  try {
    const rates = await fetchCryptoRates();
    return {
      rates: sortByDefault(rates),
      fetchedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Loader error:', error);
    throw new Error('Failed to fetch cryptocurrency rates. Please try again.');
  }
}

// Loading fallback with skeleton cards
export function HydrateFallback() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Header skeleton */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/70 dark:bg-slate-950/70 border-b border-slate-200/60 dark:border-slate-800/60 animate-pulse">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="h-8 w-48 bg-slate-200 dark:bg-slate-700 rounded" />
            <div className="h-10 w-24 bg-slate-200 dark:bg-slate-700 rounded-lg" />
          </div>
        </div>
      </header>

      {/* Skeleton grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </main>
    </div>
  );
}

export default function Index() {
  const { rates: initialRates } = useLoaderData<typeof loader>();
  const [rates, setRates] = useState(initialRates);
  const [filteredRates, setFilteredRates] = useState(initialRates);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDark, setIsDark] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const [sortType, setSortType] = useState<SortType>('default');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Load saved order from localStorage
  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);

    const savedOrder = localStorage.getItem('cryptoCardOrder');
    if (savedOrder) {
      try {
        const order: string[] = JSON.parse(savedOrder);
        const orderedRates = order
          .map((symbol) => rates.find((r) => r.symbol === symbol))
          .filter((r): r is CryptoRate => r !== undefined);
        if (orderedRates.length === rates.length) {
          setRates(orderedRates);
          setFilteredRates(orderedRates);
        }
      } catch (error) {
        console.error('Error loading saved order:', error);
      }
    }

    // Set current time (client-side only to avoid hydration mismatch)
    setCurrentTime(new Date().toLocaleTimeString());
    
    // Mark as mounted to enable interactive features
    setIsMounted(true);
  }, []);

  // Filter and sort rates (memoized for performance)
  const memoizedFilteredRates = useMemo(() => {
    const term = searchTerm.toLowerCase();
    let filtered = rates.filter(
      (rate) =>
        rate.name.toLowerCase().includes(term) ||
        rate.symbol.toLowerCase().includes(term)
    );

    // Apply sorting
    switch (sortType) {
      case 'name':
        return sortByName(filtered);
      case 'price-asc':
        return sortByPrice(filtered, true);
      case 'price-desc':
        return sortByPrice(filtered, false);
      case 'default':
      default:
        return sortByDefault(filtered);
    }
  }, [searchTerm, rates, sortType]);

  useEffect(() => {
    setFilteredRates(memoizedFilteredRates);
  }, [memoizedFilteredRates]);

  // Handle drag end (memoized to prevent recreation on re-renders)
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setRates((allRates) => {
        const oldIndex = allRates.findIndex((r) => r.symbol === active.id);
        const newIndex = allRates.findIndex((r) => r.symbol === over.id);
        
        if (oldIndex !== -1 && newIndex !== -1) {
          const newRates = arrayMove(allRates, oldIndex, newIndex);
          // Persist to localStorage
          localStorage.setItem(
            'cryptoCardOrder',
            JSON.stringify(newRates.map((r) => r.symbol))
          );
          return newRates;
        }
        return allRates;
      });
      
      // Reset to default sort after drag to preserve manual order
      if (sortType !== 'default') {
        setSortType('default');
      }
    }
  }, [sortType]);

  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const newRates = await fetchCryptoRates();
      const sortedRates = sortByDefault(newRates);
      setRates(sortedRates);
      
      // Update filtered rates with search term applied
      const term = searchTerm.toLowerCase();
      setFilteredRates(
        sortedRates.filter(
          (rate) =>
            rate.name.toLowerCase().includes(term) ||
            rate.symbol.toLowerCase().includes(term)
        )
      );
      
      // Update timestamp
      setCurrentTime(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Toggle theme (memoized to prevent recreation on re-renders)
  const toggleTheme = useCallback(() => {
    setIsDark((prevIsDark) => {
      const newIsDark = !prevIsDark;
      if (newIsDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
      return newIsDark;
    });
  }, []);

  const totalCount = rates.length;
  const visibleCount = filteredRates.length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-500 font-sans selection:bg-blue-100 dark:selection:bg-blue-900" suppressHydrationWarning>

      {/* Background decoration */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40 dark:opacity-20 overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-blue-200 dark:bg-blue-900 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] bg-indigo-200 dark:bg-indigo-900 rounded-full blur-[100px]" />
      </div>

      <Header
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortType={sortType}
        onSortChange={setSortType}
        visibleCount={visibleCount}
        totalCount={totalCount}
        isRefreshing={isRefreshing}
        onRefresh={handleRefresh}
        isDark={isDark}
        onThemeToggle={toggleTheme}
        currentTime={currentTime}
      />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {filteredRates.length === 0 ? (
          <section className="flex flex-col items-center justify-center py-20 text-center rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              {searchTerm ? `No results for "${searchTerm}"` : 'Loading Market Data'}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6">
              {searchTerm
                ? 'Check your spelling or try using the cryptocurrency symbol (e.g. BTC, ETH).'
                : 'Connecting to Coinbase for real-time exchange rates...'}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-blue-500/20"
              >
                Clear Search
              </button>
            )}
          </section>
        ) : (
          isMounted && (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCorners}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={filteredRates.map((r) => r.symbol)}
                strategy={rectSortingStrategy}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredRates.map((crypto) => (
                    <CryptoCard key={crypto.symbol} crypto={crypto} id={crypto.symbol} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )
        )}
      </main>
    </div>
  );
}
