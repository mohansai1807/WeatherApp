import { useState, useEffect } from 'react';
import {
  Search,
  MapPin,
  Droplets,
  Wind,
  Gauge,
  Thermometer,
  Eye,
  Sunrise,
  Sunset,
  AlertCircle,
  Sparkles,
  Loader2,
} from 'lucide-react';
import './App.css';

function App() {
  let [city, setCity] = useState('');
  let [wDetails, setwDetails] = useState();
  let [loading, setLoading] = useState(false);
  let [errorMsg, setErrorMsg] = useState('');

  const API_KEY = '522c58ed264f927e0e60bab4141a43b5';

  // Function to fetch weather using OpenWeatherMap API logic
  const fetchWeather = (searchCity) => {
    if (!searchCity || !searchCity.trim()) {
      setErrorMsg('Please enter a city name.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        searchCity.trim()
      )}&units=metric&appid=${API_KEY}`
    )
      .then((res) => res.json())
      .then((finalData) => {
        console.log('API RESPONSE:', finalData);
        setLoading(false);

        // Check response code (handles both 200 number and "200" string)
        if (finalData.cod == 200 || finalData.cod === '200') {
          setwDetails(finalData);
          setCity('');
          setErrorMsg('');
        } else {
          console.log('API ERROR:', finalData.message);
          setErrorMsg(finalData.message || 'City not found. Please try again.');
        }
      })
      .catch((error) => {
        console.log('FETCH ERROR:', error);
        setLoading(false);
        setErrorMsg('Failed to fetch weather data. Please check your network connection.');
      });
  };

  // Form submit handler as in original code
  let getData = (e) => {
    e.preventDefault();
    fetchWeather(city);
  };

  // Fetch initial city on load (e.g. London) so app is populated
  useEffect(() => {
    fetchWeather('London');
  }, []);

  // Format sunrise/sunset timestamps
  const formatTime = (timestamp) => {
    if (!timestamp) return '---';
    return new Date(timestamp * 1000).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Determine dynamic background gradient based on weather condition
  const getThemeClass = () => {
    if (!wDetails || !wDetails.weather || !wDetails.weather[0]) return 'bg-weather-sunny';
    const mainCondition = wDetails.weather[0].main.toLowerCase();
    const iconCode = wDetails.weather[0].icon;
    const isNight = iconCode.endsWith('n');

    if (isNight && (mainCondition.includes('clear') || mainCondition.includes('cloud'))) {
      return 'bg-weather-clear-night';
    }
    if (mainCondition.includes('rain') || mainCondition.includes('drizzle')) return 'bg-weather-rainy';
    if (mainCondition.includes('snow')) return 'bg-weather-snowy';
    if (mainCondition.includes('thunder')) return 'bg-weather-thunder';
    if (mainCondition.includes('cloud')) return 'bg-weather-cloudy';
    if (mainCondition.includes('fog') || mainCondition.includes('mist') || mainCondition.includes('haze')) return 'bg-weather-foggy';
    return 'bg-weather-sunny';
  };

  return (
    <div className={`min-h-screen ${getThemeClass()} text-white transition-all duration-700 font-sans flex flex-col justify-between`}>
      {/* Top Glassmorphic Navbar */}
      <header className="px-4 py-4 sm:px-8 glass-panel border-b border-white/10 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-500 to-amber-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold bg-gradient-to-r from-white via-blue-100 to-blue-300 bg-clip-text text-transparent tracking-tight">
                WeatherApp
              </h1>

            </div>
          </div>

          {/* Search Form (preserves original input & onSubmit logic) */}
          <form onSubmit={getData} className="flex items-center gap-2 w-full sm:w-auto max-w-md">
            <div className="relative flex-1 sm:w-80">
              <input
                type="text"
                className="w-full h-11 pl-11 pr-4 rounded-2xl glass-input text-sm text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400/50 transition-all"
                placeholder="Enter city name..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-white/50" />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="h-11 px-5 rounded-2xl bg-blue-500 hover:bg-blue-600 active:scale-95 text-white font-semibold text-sm shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
            </button>
          </form>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 py-8 w-full flex-1 space-y-6">
        {/* Preset Cities for quick 1-click search */}
        <div className="flex items-center justify-center gap-2 flex-wrap text-xs">
          <span className="text-blue-200/70 font-medium mr-1">Popular:</span>
          {['London', 'New York', 'Tokyo', 'Paris', 'Delhi', 'Sydney'].map((presetCity) => (
            <button
              key={presetCity}
              onClick={() => fetchWeather(presetCity)}
              className="px-3 py-1 rounded-full glass-panel-interactive border border-white/10 text-white/90 hover:border-blue-400/50 transition-all font-medium"
            >
              {presetCity}
            </button>
          ))}
        </div>

        {/* Error Alert Box */}
        {errorMsg && (
          <div className="glass-panel p-4 rounded-2xl border border-rose-500/30 bg-rose-500/15 text-rose-100 flex items-center gap-3 animate-fadeIn">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <div className="text-sm font-medium">{errorMsg}</div>
          </div>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div className="glass-panel p-12 rounded-3xl flex flex-col items-center justify-center space-y-3 min-h-[300px]">
            <Loader2 className="w-10 h-10 text-blue-400 animate-spin" />
            <p className="text-sm text-blue-200/80 font-medium">Fetching weather details...</p>
          </div>
        )}

        {/* Main Weather Card (Preserves wDetails rendering logic) */}
        {!loading && wDetails !== undefined && wDetails.cod == 200 && (
          <div className="space-y-6 animate-fadeIn">
            {/* Primary Weather Card */}
            <div className="relative overflow-hidden rounded-3xl glass-panel p-6 sm:p-10 border border-white/20 shadow-2xl backdrop-blur-2xl">
              <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                {/* Location Info */}
                <div className="space-y-2 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-blue-200">
                    <MapPin className="w-3.5 h-3.5 text-blue-400" />
                    <span>{wDetails.name}</span>
                    {wDetails.sys && wDetails.sys.country && (
                      <span className="bg-amber-400 text-slate-900 font-bold px-1.5 py-0.5 rounded text-[10px] uppercase">
                        {wDetails.sys.country}
                      </span>
                    )}
                  </div>

                  <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                    {wDetails.name}
                  </h2>

                  <p className="text-sm text-blue-200/80 font-medium capitalize">
                    {wDetails.weather && wDetails.weather[0] ? wDetails.weather[0].description : ''}
                  </p>
                </div>

                {/* Weather Icon & Main Temperature */}
                <div className="flex items-center gap-4 sm:gap-6">
                  {wDetails.weather && wDetails.weather[0] && (
                    <img
                      src={`https://openweathermap.org/img/wn/${wDetails.weather[0].icon}@4x.png`}
                      alt={wDetails.weather[0].description}
                      className="w-24 h-24 sm:w-32 sm:h-32 drop-shadow-[0_10px_20px_rgba(255,255,255,0.2)] animate-pulse"
                    />
                  )}

                  <div className="flex flex-col">
                    <div className="flex items-start">
                      {/* Metric Temp in Celsius (Math.round handles wDetails.main.temp directly) */}
                      <span className="text-6xl sm:text-7xl font-black text-white tracking-tighter">
                        {wDetails.main ? Math.round(wDetails.main.temp) : 0}
                      </span>
                      <span className="text-2xl sm:text-3xl font-bold text-amber-300 mt-1">°C</span>
                    </div>

                    {wDetails.main && (
                      <div className="flex items-center gap-3 text-xs text-blue-200/90 font-semibold mt-1">
                        <span>Feels like {Math.round(wDetails.main.feels_like)}°C</span>
                        <span>•</span>
                        <span>H: {Math.round(wDetails.main.temp_max)}°</span>
                        <span>L: {Math.round(wDetails.main.temp_min)}°</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Metrics Grid */}
            {wDetails.main && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {/* Humidity */}
                <div className="glass-panel-interactive p-4 rounded-2xl border border-white/10 flex flex-col justify-between space-y-2">
                  <div className="flex items-center justify-between text-blue-200/70 text-xs font-semibold">
                    <span>HUMIDITY</span>
                    <Droplets className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">{wDetails.main.humidity}%</div>
                  <div className="text-[11px] text-blue-200/60 font-medium">
                    {wDetails.main.humidity > 70 ? 'High moisture' : 'Comfortable'}
                  </div>
                </div>

                {/* Wind Speed */}
                <div className="glass-panel-interactive p-4 rounded-2xl border border-white/10 flex flex-col justify-between space-y-2">
                  <div className="flex items-center justify-between text-blue-200/70 text-xs font-semibold">
                    <span>WIND SPEED</span>
                    <Wind className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {wDetails.wind ? `${wDetails.wind.speed} m/s` : '---'}
                  </div>
                  <div className="text-[11px] text-blue-200/60 font-medium">
                    {wDetails.wind ? `${Math.round(wDetails.wind.speed * 3.6)} km/h` : 'Wind details'}
                  </div>
                </div>

                {/* Air Pressure */}
                <div className="glass-panel-interactive p-4 rounded-2xl border border-white/10 flex flex-col justify-between space-y-2">
                  <div className="flex items-center justify-between text-blue-200/70 text-xs font-semibold">
                    <span>PRESSURE</span>
                    <Gauge className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">{wDetails.main.pressure} hPa</div>
                  <div className="text-[11px] text-blue-200/60 font-medium">Atmospheric</div>
                </div>

                {/* Visibility */}
                <div className="glass-panel-interactive p-4 rounded-2xl border border-white/10 flex flex-col justify-between space-y-2">
                  <div className="flex items-center justify-between text-blue-200/70 text-xs font-semibold">
                    <span>VISIBILITY</span>
                    <Eye className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {wDetails.visibility ? `${(wDetails.visibility / 1000).toFixed(1)} km` : '10 km'}
                  </div>
                  <div className="text-[11px] text-blue-200/60 font-medium">Clear distance</div>
                </div>
              </div>
            )}

            {/* Sunrise & Sunset */}
            {wDetails.sys && (
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-panel-interactive p-4 rounded-2xl border border-white/10 flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
                    <Sunrise className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-blue-200/70">SUNRISE</div>
                    <div className="text-xl font-bold text-white">{formatTime(wDetails.sys.sunrise)}</div>
                  </div>
                </div>

                <div className="glass-panel-interactive p-4 rounded-2xl border border-white/10 flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    <Sunset className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-blue-200/70">SUNSET</div>
                    <div className="text-xl font-bold text-white">{formatTime(wDetails.sys.sunset)}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Initial / No Data State */}
        {!loading && wDetails === undefined && !errorMsg && (
          <div className="glass-panel p-12 rounded-3xl text-center space-y-3">
            <MapPin className="w-10 h-10 text-blue-400 mx-auto" />
            <h3 className="text-lg font-bold text-white">No Weather Data</h3>
            <p className="text-xs text-blue-200/70">Enter a city name above to view weather details.</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-4 border-t border-white/10 glass-panel text-center text-xs text-blue-200/60">
        <p>WeatherApp • Built with React & OpenWeatherMap API</p>
      </footer>
    </div>
  );
}

export default App;