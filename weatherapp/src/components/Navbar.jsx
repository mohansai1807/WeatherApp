import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2, Sparkles, X } from 'lucide-react';
import { searchCities } from '../services/weatherApi';

export default function Navbar({
  onSelectLocation,
  onCurrentLocation,
  unit,
  onToggleUnit,
  isLoading,
}) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Debounced search for suggestions
  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      const results = await searchCities(query);
      setSuggestions(results);
      setIsSearching(false);
      setShowDropdown(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    onSelectLocation({ name: query.trim() });
    setShowDropdown(false);
  };

  const handleSelectSuggestion = (city) => {
    setQuery(city.name);
    onSelectLocation(city);
    setShowDropdown(false);
  };

  return (
    <header className="sticky top-0 z-50 px-4 py-3 sm:px-8 glass-panel border-b border-white/10 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 to-amber-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Sparkles className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white via-blue-100 to-blue-300 bg-clip-text text-transparent tracking-tight">
              AuraWeather
            </h1>
            <p className="text-xs text-blue-200/70 hidden sm:block">Real-time Forecast & Climate Intelligence</p>
          </div>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-3 w-full md:w-auto flex-1 max-w-xl">
          <div className="relative flex-1" ref={dropdownRef}>
            <form onSubmit={handleSubmit} className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => query.length >= 2 && setShowDropdown(true)}
                placeholder="Search city (e.g. London, Tokyo, New York)..."
                className="w-full h-11 pl-11 pr-10 rounded-2xl glass-input text-sm placeholder-white/40 focus:ring-2 focus:ring-blue-400/50 transition-all"
              />
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-white/50" />
              
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    setSuggestions([]);
                  }}
                  className="absolute right-3 top-3 text-white/40 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>

            {/* Suggestions Dropdown */}
            {showDropdown && (suggestions.length > 0 || isSearching) && (
              <div className="absolute left-0 right-0 top-13 mt-1 rounded-2xl glass-panel border border-white/15 shadow-2xl overflow-hidden z-50 max-h-64 overflow-y-auto">
                {isSearching ? (
                  <div className="flex items-center justify-center p-4 text-xs text-blue-200/60 gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                    Searching cities...
                  </div>
                ) : (
                  suggestions.map((city, index) => (
                    <button
                      key={`${city.latitude}-${city.longitude}-${index}`}
                      onClick={() => handleSelectSuggestion(city)}
                      className="w-full text-left px-4 py-3 hover:bg-white/10 flex items-center justify-between border-b border-white/5 last:border-none transition-colors text-xs sm:text-sm text-white/90"
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                        <div>
                          <span className="font-semibold text-white">{city.name}</span>
                          {city.admin1 && <span className="text-white/60">, {city.admin1}</span>}
                          {city.country && <span className="text-blue-300/70"> ({city.country})</span>}
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Current Location Button */}
          <button
            onClick={onCurrentLocation}
            disabled={isLoading}
            title="Use current GPS location"
            className="h-11 px-3.5 rounded-2xl glass-panel-interactive flex items-center justify-center gap-2 text-xs font-medium text-white/90 shrink-0 hover:border-blue-400/50 transition-all disabled:opacity-50"
          >
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Near Me</span>
          </button>

          {/* Celsius / Fahrenheit Toggle */}
          <button
            onClick={onToggleUnit}
            title="Toggle temperature unit"
            className="h-11 px-3.5 rounded-2xl glass-panel-interactive flex items-center justify-center font-semibold text-xs sm:text-sm text-amber-300 shrink-0 border border-amber-400/30 hover:border-amber-400/70 transition-all"
          >
            °{unit}
          </button>
        </div>
      </div>
    </header>
  );
}
