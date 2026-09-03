import React from 'react';
import WeatherIcon from './WeatherIcon';
import { CalendarDays, Umbrella, Sun } from 'lucide-react';

export default function DailyForecast({ daily = [], unit = 'C' }) {
  if (!daily || daily.length === 0) return null;

  const displayTemp = (tempC) => {
    if (unit === 'F') {
      return Math.round((tempC * 9) / 5 + 32);
    }
    return tempC;
  };

  // Find min and max temperature across 7 days for range bar calculation
  const allMaxs = daily.map((d) => d.maxTempC);
  const allMins = daily.map((d) => d.minTempC);
  const globalMax = Math.max(...allMaxs, 35);
  const globalMin = Math.min(...allMins, 0);

  return (
    <div className="glass-panel rounded-3xl p-6 border border-white/15 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-amber-400" />
          7-Day Forecast
        </h3>
        <span className="text-xs text-blue-200/60 font-medium">Daily Outlook</span>
      </div>

      <div className="space-y-3">
        {daily.map((day, idx) => {
          const minDisplay = displayTemp(day.minTempC);
          const maxDisplay = displayTemp(day.maxTempC);

          // Calculate percentage for temperature bar range
          const leftPercent = Math.max(
            0,
            Math.min(100, ((day.minTempC - globalMin) / (globalMax - globalMin || 1)) * 100)
          );
          const rightPercent = Math.max(
            0,
            Math.min(100, ((day.maxTempC - globalMin) / (globalMax - globalMin || 1)) * 100)
          );
          const widthPercent = Math.max(10, rightPercent - leftPercent);

          return (
            <div
              key={idx}
              className="glass-panel-interactive p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              {/* Day & Icon */}
              <div className="flex items-center gap-4 w-full sm:w-48">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                  <WeatherIcon name={day.iconName} className="w-6 h-6 text-amber-300" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">
                    {day.dayName}
                    {idx === 0 && (
                      <span className="ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/30 text-blue-200">
                        Today
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-blue-200/70 font-medium truncate">
                    {day.conditionLabel}
                  </div>
                </div>
              </div>

              {/* Rain or UV Details */}
              <div className="flex items-center gap-4 text-xs font-semibold text-blue-200/80">
                {day.precipMm > 0 && (
                  <span className="flex items-center gap-1 text-cyan-300 bg-cyan-500/10 px-2 py-1 rounded-lg">
                    <Umbrella className="w-3.5 h-3.5" />
                    {day.precipMm.toFixed(1)} mm
                  </span>
                )}
                {day.uvIndex > 0 && (
                  <span className="flex items-center gap-1 text-amber-300 bg-amber-500/10 px-2 py-1 rounded-lg">
                    <Sun className="w-3.5 h-3.5" />
                    UV {day.uvIndex}
                  </span>
                )}
              </div>

              {/* Min - Temperature Bar - Max */}
              <div className="flex items-center gap-3 w-full sm:w-64 justify-end">
                <span className="text-xs font-semibold text-blue-200/70 w-8 text-right">
                  {minDisplay}°
                </span>

                <div className="flex-1 h-2 rounded-full bg-white/10 relative overflow-hidden">
                  <div
                    className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-blue-400 via-amber-300 to-rose-400"
                    style={{
                      left: `${leftPercent}%`,
                      width: `${widthPercent}%`,
                    }}
                  />
                </div>

                <span className="text-xs font-bold text-white w-8 text-left">
                  {maxDisplay}°
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
