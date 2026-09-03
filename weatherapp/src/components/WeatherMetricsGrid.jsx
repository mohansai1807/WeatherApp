import React from 'react';
import { Wind, Droplets, Sun, Gauge, Sunrise, Sunset, Compass } from 'lucide-react';

export default function WeatherMetricsGrid({ current }) {
  if (!current) return null;

  const metrics = [
    {
      id: 'wind',
      label: 'Wind Speed',
      value: `${current.windSpeedKm} km/h`,
      subValue: `Direction: ${current.windDirection}°`,
      icon: Wind,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/20',
    },
    {
      id: 'humidity',
      label: 'Humidity',
      value: `${current.humidity}%`,
      subValue: current.humidity > 70 ? 'High Moisture' : current.humidity < 30 ? 'Dry Air' : 'Optimal',
      icon: Droplets,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
    },
    {
      id: 'uv',
      label: 'UV Index',
      value: `${current.uvIndex} / 11`,
      subValue:
        current.uvIndex >= 8
          ? 'Very High (Wear Sunscreen)'
          : current.uvIndex >= 5
          ? 'Moderate Risk'
          : 'Low Risk',
      icon: Sun,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20',
    },
    {
      id: 'pressure',
      label: 'Air Pressure',
      value: `${current.pressureHpa} hPa`,
      subValue: 'Surface Pressure',
      icon: Gauge,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
    },
    {
      id: 'sunrise',
      label: 'Sunrise',
      value: current.sunrise,
      subValue: 'Morning Dawn',
      icon: Sunrise,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/20',
    },
    {
      id: 'sunset',
      label: 'Sunset',
      value: current.sunset,
      subValue: 'Evening Dusk',
      icon: Sunset,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {metrics.map((item) => {
        const IconComponent = item.icon;
        return (
          <div
            key={item.id}
            className={`glass-panel-interactive p-4 rounded-2xl border ${item.borderColor} flex flex-col justify-between space-y-3`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-blue-200/70 tracking-wide uppercase">
                {item.label}
              </span>
              <div className={`p-2 rounded-xl ${item.bgColor} ${item.color}`}>
                <IconComponent className="w-4 h-4" />
              </div>
            </div>

            <div>
              <div className="text-xl font-bold text-white tracking-tight">{item.value}</div>
              <div className="text-[11px] text-blue-200/60 font-medium truncate mt-0.5">
                {item.subValue}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
