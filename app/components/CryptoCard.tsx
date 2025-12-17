import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { memo, useMemo } from 'react';
import type { CryptoRate } from '~/lib/crypto';
import { stringToColor, stringToTextColor } from '~/lib/utils';

interface CryptoCardProps {
  crypto: CryptoRate;
  id: string;
}

function CryptoCardComponent({ crypto, id }: CryptoCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = useMemo(() => ({
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 50 : 'auto',
  }), [transform, transition, isDragging]);

  // Memoize color calculations to prevent recomputation on re-renders
  const { bgColor, textColor } = useMemo(() => ({
    bgColor: stringToColor(crypto.symbol),
    textColor: stringToTextColor(crypto.symbol),
  }), [crypto.symbol]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`group relative flex flex-col justify-between rounded-2xl border bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl dark:hover:shadow-2xl dark:shadow-slate-900/50 transition-all duration-300 overflow-hidden cursor-grab active:cursor-grabbing ${isDragging
          ? 'ring-2 ring-blue-500/70 shadow-2xl scale-105 rotate-1'
          : 'border-slate-100 dark:border-slate-800 hover:-translate-y-1'
        }`}
    >
      {/* Header with Color Accent */}
      <div
        className="relative px-5 pt-5 pb-3 flex items-start justify-between"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-inner"
            style={{ backgroundColor: bgColor, color: textColor }}
          >
            {crypto.symbol[0]}
          </div>
          <div className="flex flex-col">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg leading-tight truncate max-w-[120px]" title={crypto.name}>
              {crypto.name}
            </h3>
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 tracking-wider">
              {crypto.symbol}
            </span>
          </div>
        </div>

        <button
          className="p-2 text-slate-300 dark:text-slate-600 hover:text-slate-500 dark:hover:text-slate-400 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors pointer-events-none"
          title="Drag card to reorder"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
          </svg>
        </button>
      </div>

      {/* Body */}
      <div className="px-5 pb-5 pt-1 space-y-4">
        <div className="flex flex-col">
          <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            ${crypto.priceUSD.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
          <span className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-1">
            USD Price
          </span>
        </div>

        <div className="pt-3 border-t border-slate-50 dark:border-slate-800/50 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-300 font-mono">
              {crypto.priceBTC.toFixed(7)}
            </span>
            <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-600">
              BTC Value
            </span>
          </div>

          {/* Visual decoration */}
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)] animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

// Memoize component to prevent re-renders when parent updates
export const CryptoCard = memo(CryptoCardComponent);
