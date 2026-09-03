import React from 'react';
import WeatherIcon from './WeatherIcon';
import { Calendar, Clock, MapPin, ArrowUp, ArrowDown, Thermometer } from 'lucide-react';

export default function CurrentWeatherCard({ data, unit = 'C' }) {
  if (!data || !data.current) return null;

  const { current, cityName, country, displayLocation } = data;

  const displayTemp = (tempC) => {
    if (unit === 'F') {
      return Math.round((tempC * 9) / 5 + 32);
    }
    return tempC;
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  const currentTime = new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="relative overflow-hidden rounded-3xl glass-panel p-6 sm:p-8 border border-white/20 shadow-2xl backdrop-blur-2xl">
      {/* Subtle glowing backdrop highlight */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Left Side: Location & Date */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-xs font-medium text-blue-200">
            <MapPin className="w-3.5 h-3.5 text-blue-400" />
            <span>{cityName}</span>
            {country && <span className="px-1.5 py-0.5 rounded bg-blue-500/30 text-[10px] font-bold tracking-wide uppercase">{country}</span>}
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-none">
            {cityName}
          </h2>

          <div className="flex items-center gap-4 text-xs sm:text-sm text-blue-100/70">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-blue-300" />
              {currentDate}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-300" />
              {currentTime}
            </span>
          </div>
        </div>

        {/* Center/Right: Icon & Prominent Temperature */}
        <div className="flex items-center gap-6 sm:gap-8 self-center md:self-auto">
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 bg-white/10 rounded-full blur-xl transform scale-125" />
            <WeatherIcon
              name={current.iconName}
              className="w-20 h-20 sm:w-28 sm:h-28 text-amber-300 drop-shadow-[0_10px_20px_rgba(251,191,36,0.3)] animate-pulse"
            />
          </div>

          <div className="flex flex-col">
            <div className="flex items-start">
              <span className="text-6xl sm:text-7xl font-black text-white tracking-tighter drop-shadow-md">
                {displayTemp(current.tempC)}
              </span>
              <span className="text-2xl sm:text-3xl font-bold text-amber-300 mt-1">
                °{unit}
              </span>
            </div>

            <p className="text-lg font-semibold text-blue-100 capitalize tracking-wide">
              {current.conditionLabel}
            </p>

            <div className="flex items-center gap-3 mt-1 text-xs text-blue-200/80 font-medium">
              <span className="flex items-center gap-1">
                <Thermometer className="w-3.5 h-3.5 text-blue-300" />
                Feels like {displayTemp(current.feelsLikeC)}°{unit}
              </span>
              <span className="flex items-center text-emerald-400">
                <ArrowUp className="w-3 h-3" />
                {displayTemp(current.tempMaxC)}°
              </span>
              <span className="flex items-center text-blue-300">
                <ArrowDown className="w-3 h-3" />
                {displayTemp(current.tempMinC)}°
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
