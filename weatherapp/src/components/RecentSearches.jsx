import React from 'react';
import { History, MapPin, Trash2 } from 'lucide-react';

export default function RecentSearches({ items = [], onSelect, onClear }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap py-2">
      <span className="text-xs font-semibold text-blue-200/60 flex items-center gap-1 mr-1">
        <History className="w-3.5 h-3.5 text-blue-400" />
        Recent:
      </span>

      {items.map((city, idx) => (
        <button
          key={`${city.name}-${idx}`}
          onClick={() => onSelect(city)}
          className="px-3 py-1 rounded-full glass-panel-interactive border border-white/10 text-xs font-medium text-white/90 flex items-center gap-1.5 hover:border-blue-400/50 transition-all"
        >
          <MapPin className="w-3 h-3 text-blue-400" />
          {city.name}
        </button>
      ))}

      <button
        onClick={onClear}
        title="Clear recent searches"
        className="p-1 rounded-full text-white/40 hover:text-rose-400 hover:bg-rose-500/10 transition-colors ml-1"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
