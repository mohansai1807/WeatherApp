import React from 'react';
import {
  Sun,
  SunMedium,
  Moon,
  Cloud,
  CloudSun,
  CloudMoon,
  CloudRain,
  CloudRainWind,
  CloudLightning,
  CloudSnow,
  CloudFog,
  CloudDrizzle,
  Wind,
  Droplets,
  Eye,
  Thermometer,
  Gauge,
  Sunrise,
  Sunset,
  Navigation,
  Compass,
} from 'lucide-react';

const iconMap = {
  Sun,
  SunMedium,
  Moon,
  Cloud,
  CloudSun,
  CloudMoon,
  CloudRain,
  CloudRainWind,
  CloudLightning,
  CloudSnow,
  CloudFog,
  CloudDrizzle,
  Wind,
  Droplets,
  Eye,
  Thermometer,
  Gauge,
  Sunrise,
  Sunset,
  Navigation,
  Compass,
};

export default function WeatherIcon({ name, className = 'w-6 h-6', ...props }) {
  const Component = iconMap[name] || Cloud;
  return <Component className={className} {...props} />;
}
