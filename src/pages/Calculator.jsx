import { useState, useEffect } from 'react';
import { Cloud, Thermometer, Droplets, Wind, Sun, Zap } from 'lucide-react';

function Calculator() {
  const [selectedCity, setSelectedCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [solarOutput, setSolarOutput] = useState(null);
  const [predicting, setPredicting] = useState(false);
  const [error, setError] = useState('');

  const cities = ['Delhi', 'Mumbai', 'Bangalore', 'Jaipur'];

  useEffect(() => {
    if (selectedCity) {
      fetchWeatherData(selectedCity);
    }
  }, [selectedCity]);

  const fetchWeatherData = async (city) => {
    setLoading(true);
    setError('');
    setSolarOutput(null);

    try {
      const apiKey = 'YOUR_WEATHER_API_KEY';
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }

      const data = await response.json();

      setWeatherData({
        temperature: data.main.temp,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        cloudCover: data.clouds.all,
        condition: data.weather[0].description,
      });
    } catch (err) {
      setError('Unable to fetch weather data. Using demo values.');
      setWeatherData({
        temperature: 28,
        humidity: 65,
        windSpeed: 3.5,
        cloudCover: 30,
        condition: 'partly cloudy',
      });
    } finally {
      setLoading(false);
    }
  };

  const generateSolarOutput = async () => {
    if (!weatherData) return;

    setPredicting(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          temperature: weatherData.temperature,
          humidity: weatherData.humidity,
          wind_speed: weatherData.windSpeed,
          cloud_cover: weatherData.cloudCover,
        }),
      });

      if (!response.ok) {
        throw new Error('Prediction service unavailable');
      }

      const data = await response.json();
      setSolarOutput(data.solar_output);
    } catch (err) {
      setError('Flask backend not running. Using demo calculation.');
      const demoOutput =
        weatherData.temperature * 0.3 -
        weatherData.cloudCover * 0.2 +
        weatherData.windSpeed * 0.1;
      setSolarOutput(Math.max(0, parseFloat(demoOutput.toFixed(2))));
    } finally {
      setPredicting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-yellow-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Sun className="w-16 h-16 text-yellow-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Solar Output Predictor
          </h1>
          <p className="text-gray-600">
            Select a city to fetch weather data and predict solar energy output
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <span className="bg-sky-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">
                1
              </span>
              Select City
            </h2>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-sky-500 text-lg"
            >
              <option value="">Choose a city...</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {loading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-sky-500 border-t-transparent"></div>
              <p className="text-gray-600 mt-4">Fetching weather data...</p>
            </div>
          )}

          {weatherData && !loading && (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="bg-sky-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">
                    2
                  </span>
                  Weather Data
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border-2 border-orange-200">
                    <div className="flex items-center mb-2">
                      <Thermometer className="w-6 h-6 text-orange-600 mr-2" />
                      <span className="font-semibold text-gray-700">Temperature</span>
                    </div>
                    <p className="text-3xl font-bold text-orange-600">
                      {weatherData.temperature}°C
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border-2 border-blue-200">
                    <div className="flex items-center mb-2">
                      <Droplets className="w-6 h-6 text-blue-600 mr-2" />
                      <span className="font-semibold text-gray-700">Humidity</span>
                    </div>
                    <p className="text-3xl font-bold text-blue-600">
                      {weatherData.humidity}%
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-4 rounded-lg border-2 border-teal-200">
                    <div className="flex items-center mb-2">
                      <Wind className="w-6 h-6 text-teal-600 mr-2" />
                      <span className="font-semibold text-gray-700">Wind Speed</span>
                    </div>
                    <p className="text-3xl font-bold text-teal-600">
                      {weatherData.windSpeed} m/s
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg border-2 border-gray-300">
                    <div className="flex items-center mb-2">
                      <Cloud className="w-6 h-6 text-gray-600 mr-2" />
                      <span className="font-semibold text-gray-700">Cloud Cover</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-600">
                      {weatherData.cloudCover}%
                    </p>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-sky-50 rounded-lg border border-sky-200">
                  <p className="text-gray-700">
                    <span className="font-semibold">Condition:</span>{' '}
                    <span className="capitalize">{weatherData.condition}</span>
                  </p>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="bg-sky-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">
                    3
                  </span>
                  Generate Prediction
                </h2>
                <button
                  onClick={generateSolarOutput}
                  disabled={predicting}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold py-4 rounded-lg shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {predicting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                      Calculating...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 mr-2" />
                      Generate Solar Output
                    </>
                  )}
                </button>
              </div>

              {solarOutput !== null && (
                <div className="mb-4">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="bg-sky-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">
                      4
                    </span>
                    Prediction Result
                  </h2>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-xl border-4 border-green-300 text-center">
                    <Sun className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                    <p className="text-gray-700 text-lg mb-2">Predicted Solar Output</p>
                    <p className="text-5xl font-bold text-green-600">
                      {solarOutput} <span className="text-3xl">kWh</span>
                    </p>
                  </div>
                </div>
              )}
            </>
          )}

          {error && (
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
              <p className="text-yellow-700">{error}</p>
            </div>
          )}
        </div>

        <div className="text-center text-sm text-gray-600">
          <p>
            Note: Make sure the Flask backend is running on localhost:5000 for live
            predictions
          </p>
        </div>
      </div>
    </div>
  );
}

export default Calculator;
