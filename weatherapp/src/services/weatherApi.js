// Weather API Service using Open-Meteo (Free, No Key Required) with fallback support for OpenWeatherMap

const WMO_CODE_MAP = {
  0: { label: 'Clear Sky', icon: 'Sun', theme: 'sunny' },
  1: { label: 'Mainly Clear', icon: 'SunMedium', theme: 'sunny' },
  2: { label: 'Partly Cloudy', icon: 'CloudSun', theme: 'cloudy' },
  3: { label: 'Overcast', icon: 'Cloud', theme: 'cloudy' },
  45: { label: 'Foggy', icon: 'CloudFog', theme: 'foggy' },
  48: { label: 'Depositing Rime Fog', icon: 'CloudFog', theme: 'foggy' },
  51: { label: 'Light Drizzle', icon: 'CloudDrizzle', theme: 'drizzle' },
  53: { label: 'Moderate Drizzle', icon: 'CloudDrizzle', theme: 'drizzle' },
  55: { label: 'Dense Drizzle', icon: 'CloudDrizzle', theme: 'drizzle' },
  56: { label: 'Light Freezing Drizzle', icon: 'CloudSnow', theme: 'snowy' },
  57: { label: 'Dense Freezing Drizzle', icon: 'CloudSnow', theme: 'snowy' },
  61: { label: 'Slight Rain', icon: 'CloudRain', theme: 'rainy' },
  63: { label: 'Moderate Rain', icon: 'CloudRain', theme: 'rainy' },
  65: { label: 'Heavy Rain', icon: 'CloudRainWind', theme: 'rainy' },
  66: { label: 'Light Freezing Rain', icon: 'CloudSnow', theme: 'snowy' },
  67: { label: 'Heavy Freezing Rain', icon: 'CloudSnow', theme: 'snowy' },
  71: { label: 'Slight Snow Fall', icon: 'CloudSnow', theme: 'snowy' },
  73: { label: 'Moderate Snow Fall', icon: 'CloudSnow', theme: 'snowy' },
  75: { label: 'Heavy Snow Fall', icon: 'CloudSnow', theme: 'snowy' },
  77: { label: 'Snow Grains', icon: 'CloudSnow', theme: 'snowy' },
  80: { label: 'Slight Rain Showers', icon: 'CloudRain', theme: 'rainy' },
  81: { label: 'Moderate Rain Showers', icon: 'CloudRain', theme: 'rainy' },
  82: { label: 'Violent Rain Showers', icon: 'CloudRainWind', theme: 'rainy' },
  85: { label: 'Slight Snow Showers', icon: 'CloudSnow', theme: 'snowy' },
  86: { label: 'Heavy Snow Showers', icon: 'CloudSnow', theme: 'snowy' },
  95: { label: 'Thunderstorm', icon: 'CloudLightning', theme: 'thunder' },
  96: { label: 'Thunderstorm with Slight Hail', icon: 'CloudLightning', theme: 'thunder' },
  99: { label: 'Thunderstorm with Heavy Hail', icon: 'CloudLightning', theme: 'thunder' },
};

export function getWeatherConditionInfo(code, isDay = 1) {
  const match = WMO_CODE_MAP[code] || { label: 'Unknown Condition', icon: 'Cloud', theme: 'cloudy' };
  if (!isDay && (code === 0 || code === 1)) {
    return {
      label: match.label === 'Clear Sky' ? 'Clear Night' : match.label,
      icon: 'Moon',
      theme: 'clear-night',
    };
  }
  return match;
}

/**
 * Search city suggestions using Open-Meteo Geocoding API
 */
export async function searchCities(query) {
  if (!query || query.trim().length < 2) return [];
  try {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        query.trim()
      )}&count=6&language=en&format=json`
    );
    if (!response.ok) throw new Error('Geocoding service error');
    const data = await response.json();
    if (!data.results) return [];
    return data.results.map((item) => ({
      name: item.name,
      country: item.country || '',
      countryCode: item.country_code || '',
      admin1: item.admin1 || '',
      latitude: item.latitude,
      longitude: item.longitude,
      displayLabel: `${item.name}${item.admin1 ? `, ${item.admin1}` : ''}${
        item.country ? `, ${item.country}` : ''
      }`,
    }));
  } catch (err) {
    console.error('Error fetching city suggestions:', err);
    return [];
  }
}

/**
 * Fetch full weather data (Current, Hourly, 7-Day) by Latitude and Longitude
 */
export async function fetchWeatherData(lat, lon, locationInfo = {}) {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum&timezone=auto`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch weather data from Open-Meteo');
    }
    const data = await response.json();

    const current = data.current;
    const daily = data.daily;
    const hourly = data.hourly;

    const condition = getWeatherConditionInfo(current.weather_code, current.is_day);

    // Format hourly data (next 24 hours starting from current hour)
    const currentHourIndex = hourly.time.findIndex((t) => new Date(t) >= new Date()) || 0;
    const hourlyList = hourly.time
      .slice(currentHourIndex, currentHourIndex + 24)
      .map((timeStr, idx) => {
        const i = currentHourIndex + idx;
        const hourDate = new Date(timeStr);
        const hourLabel = hourDate.toLocaleTimeString([], { hour: 'numeric', hour12: true });
        const hCode = hourly.weather_code[i];
        const hCondition = getWeatherConditionInfo(hCode, current.is_day);
        return {
          time: hourLabel,
          tempC: Math.round(hourly.temperature_2m[i]),
          pop: hourly.precipitation_probability ? hourly.precipitation_probability[i] : 0,
          weatherCode: hCode,
          iconName: hCondition.icon,
        };
      });

    // Format 7-day daily data
    const dailyList = daily.time.map((timeStr, idx) => {
      const dDate = new Date(timeStr);
      const dayName = idx === 0 ? 'Today' : dDate.toLocaleDateString('en-US', { weekday: 'short' });
      const dCode = daily.weather_code[idx];
      const dCondition = getWeatherConditionInfo(dCode, 1);
      return {
        date: timeStr,
        dayName,
        maxTempC: Math.round(daily.temperature_2m_max[idx]),
        minTempC: Math.round(daily.temperature_2m_min[idx]),
        weatherCode: dCode,
        conditionLabel: dCondition.label,
        iconName: dCondition.icon,
        precipMm: daily.precipitation_sum ? daily.precipitation_sum[idx] : 0,
        uvIndex: daily.uv_index_max ? Math.round(daily.uv_index_max[idx]) : 0,
      };
    });

    return {
      cityName: locationInfo.name || 'Current Location',
      country: locationInfo.country || '',
      countryCode: locationInfo.countryCode || '',
      displayLocation: locationInfo.displayLabel || locationInfo.name || 'Current Location',
      latitude: lat,
      longitude: lon,
      current: {
        tempC: Math.round(current.temperature_2m),
        feelsLikeC: Math.round(current.apparent_temperature),
        humidity: current.relative_humidity_2m,
        windSpeedKm: Math.round(current.wind_speed_10m),
        windDirection: current.wind_direction_10m,
        pressureHpa: Math.round(current.surface_pressure),
        isDay: current.is_day,
        weatherCode: current.weather_code,
        conditionLabel: condition.label,
        conditionTheme: condition.theme,
        iconName: condition.icon,
        uvIndex: daily.uv_index_max ? Math.round(daily.uv_index_max[0]) : 0,
        tempMaxC: Math.round(daily.temperature_2m_max[0]),
        tempMinC: Math.round(daily.temperature_2m_min[0]),
        sunrise: daily.sunrise[0] ? new Date(daily.sunrise[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '---',
        sunset: daily.sunset[0] ? new Date(daily.sunset[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '---',
      },
      hourly: hourlyList,
      daily: dailyList,
    };
  } catch (error) {
    console.error('fetchWeatherData Error:', error);
    throw error;
  }
}

/**
 * Fetch weather by City Name (First geocodes, then fetches full weather)
 */
export async function fetchWeatherByCityName(cityName) {
  const cities = await searchCities(cityName);
  if (!cities || cities.length === 0) {
    throw new Error(`City "${cityName}" not found. Please check spelling.`);
  }
  const topMatch = cities[0];
  return await fetchWeatherData(topMatch.latitude, topMatch.longitude, topMatch);
}

/**
 * Fetch weather using browser Geolocation API
 */
export async function fetchWeatherByCoords(lat, lon) {
  // Reverse geocoding to find city name
  let locationInfo = { name: 'Your Location', country: '' };
  try {
    const revRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${lat},${lon}&count=1`
    );
    if (revRes.ok) {
      const revData = await revRes.json();
      if (revData.results && revData.results[0]) {
        locationInfo = {
          name: revData.results[0].name,
          country: revData.results[0].country || '',
          countryCode: revData.results[0].country_code || '',
        };
      }
    }
  } catch (e) {
    // ignore fallback
  }

  return await fetchWeatherData(lat, lon, locationInfo);
}
