import { useState } from "react";
import { Cloud, Thermometer, Droplets, Wind, Sun, ChevronDown, ChevronUp } from "lucide-react";
import bgImage from "../assests/sky.jpg";

const BACKEND_URL = "https://solarmate-ai.onrender.com/predict";

// ─── Reusable Solar Output Card ──────────────────────────────────────────────
function SolarOutputCard({ value }) {
  return (
    <div className="mt-6 text-center bg-gradient-to-br from-yellow-50 to-blue-50 p-6 rounded-2xl border border-yellow-200 shadow-inner">
      <Sun className="mx-auto mb-3 text-yellow-500 animate-spin-slow" size={40} />
      <p className="text-sm uppercase tracking-widest text-gray-500 font-semibold">
        Predicted Solar Output
      </p>
      <h2 className="text-5xl font-extrabold text-yellow-600 mt-2 tracking-tight">
        {value} <span className="text-2xl font-semibold text-gray-500">kWh</span>
      </h2>
    </div>
  );
}

// ─── Weather Grid Card ────────────────────────────────────────────────────────
function WeatherCard({ icon, label, value, bg }) {
  return (
    <div className={`p-4 border rounded-xl flex items-center gap-3 ${bg}`}>
      {icon}
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
        <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
function Calculator() {
  const cities = [
    "Delhi","Mumbai","Bangalore","Hyderabad","Chennai","Kolkata",
    "Pune","Ahmedabad","Jaipur","Lucknow","Chandigarh","Bhopal",
    "Patna","Ranchi","Raipur","Bhubaneswar","Guwahati","Dehradun",
    "Shimla","Panaji","Thiruvananthapuram","Kochi","Indore","Nagpur",
    "Surat","Vadodara","Visakhapatnam","Mysore","Coimbatore","Amritsar",
  ];

  // ── API-based state ──
  const [selectedCity, setSelectedCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [apiSolarOutput, setApiSolarOutput] = useState(null);
  const [predicting, setPredicting] = useState(false);
  const [apiError, setApiError] = useState("");

  // ── Manual input state ──
  const [accordionOpen, setAccordionOpen] = useState(false);
  const [manualInput, setManualInput] = useState({
    temperature: "",
    humidity: "",
    windSpeed: "",
    cloudCover: "",
  });
  const [manualPredicting, setManualPredicting] = useState(false);
  const [manualSolarOutput, setManualSolarOutput] = useState(null);
  const [manualError, setManualError] = useState("");

  // ── Fetch weather ──
  const fetchWeatherData = async (city) => {
    setLoadingWeather(true);
    setApiError("");
    setApiSolarOutput(null);

    try {
      const apiKey = "6ce99dc4a2d5908330f49db66e3a8e09";
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );
      if (!response.ok) throw new Error("Weather API error");
      const data = await response.json();
      setWeatherData({
        temperature: data.main.temp,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        cloudCover: data.clouds.all,
        condition: data.weather[0].description,
      });
    } catch (err) {
      console.error("Weather fetch error:", err);
      setApiError("Weather API failed. Demo values are being used.");
      setWeatherData({ temperature: 28, humidity: 60, windSpeed: 3, cloudCover: 20, condition: "partly cloudy" });
    } finally {
      setLoadingWeather(false);
    }
  };

  const handleCityChange = (e) => {
    const city = e.target.value;
    setSelectedCity(city);
    if (city) fetchWeatherData(city);
  };

  // ── API-based prediction ──
  const generateSolarOutput = async () => {
    if (!weatherData) return;
    setPredicting(true);
    setApiError("");

    try {
      const response = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          temperature: weatherData.temperature,
          humidity: weatherData.humidity,
          wind_speed: weatherData.windSpeed,
          cloud_cover: weatherData.cloudCover,
        }),
      });

      if (!response.ok) {
        let errMsg = "Backend error";
        try { const d = await response.json(); errMsg = d.error || errMsg; } catch {}
        throw new Error(errMsg);
      }

      const result = await response.json();
      const output = parseFloat(result.solar_output);
      if (isNaN(output)) throw new Error("Invalid prediction value");
      setApiSolarOutput(output);
    } catch (err) {
      const demo = Math.max(0, parseFloat(
        (weatherData.temperature * 0.3 - weatherData.cloudCover * 0.2 + weatherData.windSpeed * 0.1).toFixed(2)
      ));
      setApiSolarOutput(demo);
      setApiError(`⚠️ ${err.message} — Showing demo prediction.`);
    } finally {
      setPredicting(false);
    }
  };

  // ── Manual prediction ──
  const handleManualInputChange = (e) => {
    const { name, value } = e.target;
    setManualInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleManualPrediction = async () => {
    const { temperature, humidity, windSpeed, cloudCover } = manualInput;
    if ([temperature, humidity, windSpeed, cloudCover].some((v) => v === "")) {
      setManualError("⚠️ Please fill in all fields.");
      return;
    }

    setManualPredicting(true);
    setManualError("");
    setManualSolarOutput(null);

    try {
      const response = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          temperature: parseFloat(temperature),
          humidity: parseFloat(humidity),
          wind_speed: parseFloat(windSpeed),
          cloud_cover: parseFloat(cloudCover),
        }),
      });

      if (!response.ok) {
        let errMsg = "Backend error";
        try { const d = await response.json(); errMsg = d.error || errMsg; } catch {}
        throw new Error(errMsg);
      }

      const result = await response.json();
      const output = parseFloat(result.solar_output);
      if (isNaN(output)) throw new Error("Invalid prediction value");
      setManualSolarOutput(output);
    } catch (err) {
      setManualError(`⚠️ ${err.message}`);
    } finally {
      setManualPredicting(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen bg-cover bg-center py-12 px-4"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header */}
        <div className="text-center">
          <Sun className="w-16 h-16 text-yellow-400 mx-auto mb-4 drop-shadow-lg" />
          <h1 className="text-5xl font-bold text-white drop-shadow-md">
            Solar Output Predictor
          </h1>
          <p className="text-slate-200 mt-2 text-lg">
            Select a city → Fetch weather → Generate solar output
          </p>
        </div>

        {/* ── API Section ── */}
        <div className="bg-white/95 backdrop-blur p-8 rounded-3xl shadow-2xl">

          <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <span className="bg-yellow-100 text-yellow-700 rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold">1</span>
            Select City
          </h2>
          <select
            value={selectedCity}
            onChange={handleCityChange}
            className="w-full border border-gray-200 p-3 rounded-xl mb-6 focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-gray-50 text-gray-700"
          >
            <option value="">Choose a city...</option>
            {cities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>

          {loadingWeather && (
            <p className="text-center text-gray-400 animate-pulse mb-4">⏳ Fetching weather data...</p>
          )}

          {weatherData && !loadingWeather && (
            <>
              <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-700 rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold">2</span>
                Weather Data
                <span className="ml-2 text-sm font-normal text-gray-400 italic capitalize">— {weatherData.condition}</span>
              </h2>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <WeatherCard icon={<Thermometer className="text-orange-500" />} label="Temperature" value={`${weatherData.temperature}°C`} bg="bg-orange-50" />
                <WeatherCard icon={<Droplets className="text-blue-500" />} label="Humidity" value={`${weatherData.humidity}%`} bg="bg-blue-50" />
                <WeatherCard icon={<Wind className="text-green-500" />} label="Wind Speed" value={`${weatherData.windSpeed} m/s`} bg="bg-green-50" />
                <WeatherCard icon={<Cloud className="text-gray-500" />} label="Cloud Cover" value={`${weatherData.cloudCover}%`} bg="bg-gray-50" />
              </div>

              <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <span className="bg-green-100 text-green-700 rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold">3</span>
                Generate Prediction
              </h2>
              <button
                onClick={generateSolarOutput}
                disabled={predicting}
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 text-white py-3 rounded-xl hover:from-yellow-500 hover:to-orange-500 transition-all font-bold text-lg shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {predicting ? "⏳ Calculating..." : "⚡ Generate Solar Output"}
              </button>
            </>
          )}

          {apiSolarOutput !== null && <SolarOutputCard value={apiSolarOutput} />}

          {apiError && (
            <p className="mt-4 text-red-700 bg-red-50 border border-red-200 p-3 rounded-xl text-sm">
              {apiError}
            </p>
          )}
        </div>

        {/* ── Manual Input Section (Accordion) ── */}
        <div className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl overflow-hidden">

          {/* Accordion Toggle */}
          <button
            onClick={() => setAccordionOpen((prev) => !prev)}
            className="w-full flex items-center justify-between px-8 py-5 text-left hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="bg-sky-100 text-sky-700 rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold">4</span>
              <span className="text-xl font-semibold text-gray-700">Manual Input</span>
              <span className="text-sm text-gray-400 hidden sm:inline">— Enter custom values</span>
            </div>
            <div className={`transition-transform duration-300 ${accordionOpen ? "rotate-180" : "rotate-0"}`}>
              <ChevronDown className="text-gray-400 w-5 h-5" />
            </div>
          </button>

          {/* Accordion Body */}
          <div
            className={`transition-all duration-500 ease-in-out overflow-hidden ${
              accordionOpen ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="px-8 pb-8 pt-2 border-t border-gray-100">
              <p className="text-sm text-gray-400 mb-5">
                Enter weather parameters manually to get an independent solar output prediction.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { name: "temperature", placeholder: "Temperature (°C)", icon: "🌡️" },
                  { name: "humidity",    placeholder: "Humidity (%)",       icon: "💧" },
                  { name: "windSpeed",   placeholder: "Wind Speed (m/s)",   icon: "💨" },
                  { name: "cloudCover",  placeholder: "Cloud Cover (%)",    icon: "☁️" },
                ].map(({ name, placeholder, icon }) => (
                  <div key={name} className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg pointer-events-none">
                      {icon}
                    </span>
                    <input
                      type="number"
                      name={name}
                      value={manualInput[name]}
                      onChange={handleManualInputChange}
                      placeholder={placeholder}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 bg-gray-50 text-gray-700 placeholder-gray-400"
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={handleManualPrediction}
                disabled={manualPredicting}
                className="mt-6 w-full bg-gradient-to-r from-sky-500 to-blue-500 text-white font-bold py-3 rounded-xl hover:from-sky-600 hover:to-blue-600 transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed text-lg"
              >
                {manualPredicting ? "⏳ Generating..." : "⚡ Generate Prediction"}
              </button>

              {manualError && (
                <p className="mt-4 text-red-700 bg-red-50 border border-red-200 p-3 rounded-xl text-sm">
                  {manualError}
                </p>
              )}

              {manualSolarOutput !== null && <SolarOutputCard value={manualSolarOutput} />}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Calculator;