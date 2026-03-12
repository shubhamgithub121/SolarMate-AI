import { useState } from "react";
import { Cloud, Thermometer, Droplets, Wind, Sun } from "lucide-react";
import bgImage from "../assests/sky.jpg";

function Calculator() {

  const BACKEND_URL = "http://localhost:5000/predict";

  const [selectedCity, setSelectedCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [solarOutput, setSolarOutput] = useState(null);
  const [predicting, setPredicting] = useState(false);
  const [error, setError] = useState("");

  const cities = [
    "Delhi","Mumbai","Bangalore","Hyderabad","Chennai","Kolkata",
    "Pune","Ahmedabad","Jaipur","Lucknow","Chandigarh","Bhopal",
    "Patna","Ranchi","Raipur","Bhubaneswar","Guwahati","Dehradun",
    "Shimla","Panaji","Thiruvananthapuram","Kochi","Indore","Nagpur",
    "Surat","Vadodara","Visakhapatnam","Mysore","Coimbatore","Amritsar"
  ];

  const fetchWeatherData = async (city) => {
    setLoading(true);
    setError("");
    setSolarOutput(null);

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
      setError("Weather API failed. Demo values use ho rahe hain.");
      setWeatherData({
        temperature: 28,
        humidity: 60,
        windSpeed: 3,
        cloudCover: 20,
        condition: "partly cloudy",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCityChange = (e) => {
    const city = e.target.value;
    setSelectedCity(city);
    if (city) fetchWeatherData(city);
  };

  const generateSolarOutput = async () => {
    if (!weatherData) return;
    setPredicting(true);
    setError("");

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
        try {
          const errData = await response.json();
          errMsg = errData.error || errMsg;
          console.error("Backend error details:", errData);
        } catch {
          console.error("Backend ne JSON nahi diya");
        }
        throw new Error(errMsg);
      }

      const result = await response.json();
      const output = parseFloat(result.solar_output);
      if (isNaN(output)) throw new Error("Invalid prediction value");
      setSolarOutput(output);

    } catch (err) {
      console.error("Prediction error:", err.message);
      const demoOutput =
        weatherData.temperature * 0.3 -
        weatherData.cloudCover * 0.2 +
        weatherData.windSpeed * 0.1;
      setSolarOutput(Math.max(0, parseFloat(demoOutput.toFixed(2))));
      setError(`⚠️ ${err.message} — Demo prediction dikh rahi hai.`);
    } finally {
      setPredicting(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center py-12 px-4"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="max-w-4xl mx-auto">

        <div className="text-center mb-8">
          <Sun className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-5xl font-bold text-white drop-shadow">
            Solar Output Predictor
          </h1>
          <p className="text-slate-50 mt-2">
            Select city → Fetch weather → Generate solar output
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-xl">

          <h2 className="text-xl font-semibold mb-4">1️⃣ Select City</h2>
          <select
            value={selectedCity}
            onChange={handleCityChange}
            className="w-full border p-3 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            <option value="">Choose a city...</option>
            {cities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>

          {loading && (
            <p className="text-center text-gray-500 animate-pulse mb-4">
              ⏳ Fetching weather data...
            </p>
          )}

          {weatherData && !loading && (
            <>
              <h2 className="text-xl font-semibold mb-4">2️⃣ Weather Data</h2>
              <div className="grid md:grid-cols-2 gap-4 mb-6">

                <div className="p-4 border rounded-lg flex items-center gap-3 bg-orange-50">
                  <Thermometer className="text-orange-500" />
                  <div>
                    <p className="text-sm text-gray-500">Temperature</p>
                    <h3 className="text-2xl font-bold">{weatherData.temperature}°C</h3>
                  </div>
                </div>

                <div className="p-4 border rounded-lg flex items-center gap-3 bg-blue-50">
                  <Droplets className="text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500">Humidity</p>
                    <h3 className="text-2xl font-bold">{weatherData.humidity}%</h3>
                  </div>
                </div>

                <div className="p-4 border rounded-lg flex items-center gap-3 bg-green-50">
                  <Wind className="text-green-500" />
                  <div>
                    <p className="text-sm text-gray-500">Wind Speed</p>
                    <h3 className="text-2xl font-bold">{weatherData.windSpeed} m/s</h3>
                  </div>
                </div>

                <div className="p-4 border rounded-lg flex items-center gap-3 bg-gray-50">
                  <Cloud className="text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Cloud Cover</p>
                    <h3 className="text-2xl font-bold">{weatherData.cloudCover}%</h3>
                  </div>
                </div>

              </div>
            </>
          )}

          {weatherData && !loading && (
            <>
              <h2 className="text-xl font-semibold mb-4">3️⃣ Generate Prediction</h2>
              <button
                onClick={generateSolarOutput}
                disabled={predicting}
                className="w-full bg-yellow-500 text-white py-3 rounded-lg hover:bg-yellow-600 transition font-semibold text-lg disabled:opacity-60"
              >
                {predicting ? "⏳ Calculating..." : "⚡ Generate Solar Output"}
              </button>
            </>
          )}

          {solarOutput !== null && (
            <div className="mt-6 text-center bg-green-100 p-6 rounded-lg border border-green-300">
              <Sun className="mx-auto mb-3 text-yellow-500" size={40} />
              <p className="text-lg text-gray-600">Predicted Solar Output</p>
              <h2 className="text-4xl font-bold text-green-700 mt-1">
                {solarOutput} kWh
              </h2>
            </div>
          )}

          {error && (
            <p className="mt-4 text-yellow-800 bg-yellow-100 border border-yellow-300 p-3 rounded-lg text-sm">
              {error}
            </p>
          )}

        </div>
      </div>
    </div>
  );
}

export default Calculator;