import React from 'react';
import WeatherIcon from './WeatherIcon';
import { Clock, Umbrella } from 'lucide-react';

export default function HourlyForecast({ hourly = [], unit = 'C' }) {
  if (!hourly || hourly.length === 0) return null;

  const displayTemp = (tempC) => {
    if (unit === 'F') {
      return Math.round((tempC * 9) / 5 + 32);
    }
    return tempC;
  };

  return (
    <div className="glass-panel rounded-3xl p-6 border border-white/15 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-400" />
          24-Hour Hourly Forecast
        </h3>
        <span className="text-xs text-blue-200/60 font-medium">Scroll horizontally →</span>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto pb-3 pt-1 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        {hourly.map((item, index) => (
          <div
            key={index}
            className="glass-panel-interactive min-w-[90px] p-3.5 rounded-2xl flex flex-col items-center justify-between space-y-2 border border-white/10 shrink-0 text-center"
          >
            <span className="text-xs font-semibold text-blue-100/80">{item.time}</span>

            <div className="my-1">
              <WeatherIcon
                name={item.iconName}
                className="w-8 h-8 text-amber-300 drop-shadow-sm hover:scale-110 transition-transform"
              />
            </div>

            <div className="text-base font-extrabold text-white">
              {displayTemp(item.tempC)}°{unit}
            </div>

            {item.pop > 0 ? (
              <div className="flex items-center gap-1 text-[10px] font-bold text-cyan-300">
                <Umbrella className="w-3 h-3" />
                {item.pop}%
              </div>
            ) : (
              <div className="text-[10px] text-white/30 font-medium">0% precip</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
