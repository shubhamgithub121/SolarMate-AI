import { Database, Brain, Activity, Target } from 'lucide-react';

function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">About the Project</h1>
          <p className="text-xl text-gray-600">
            Understanding the Solar Energy Output Prediction System
          </p>
        </div>

        <div className="space-y-12">
          <section className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center mb-6">
              <Target className="w-10 h-10 text-sky-600 mr-4" />
              <h2 className="text-3xl font-bold text-gray-900">Problem Statement</h2>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed">
              Solar power output is highly dependent on weather conditions such as
              temperature, humidity, wind speed, and cloud cover. Predicting solar
              energy output accurately helps in:
            </p>
            <ul className="mt-4 space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-600 mr-2 mt-1">✓</span>
                <span>
                  Optimizing renewable energy systems and reducing dependency on
                  non-renewable sources
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2 mt-1">✓</span>
                <span>
                  Efficient grid management and energy storage planning
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2 mt-1">✓</span>
                <span>
                  Better resource allocation and cost reduction for solar farms
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2 mt-1">✓</span>
                <span>
                  Improving overall sustainability and environmental impact
                </span>
              </li>
            </ul>
          </section>

          <section className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center mb-6">
              <Database className="w-10 h-10 text-sky-600 mr-4" />
              <h2 className="text-3xl font-bold text-gray-900">Dataset</h2>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              The machine learning model is trained on comprehensive weather datasets
              collected from Kaggle and other reliable sources. The dataset includes:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-sky-50 p-4 rounded-lg border-2 border-sky-200">
                <h3 className="font-semibold text-gray-900 mb-2">Temperature (°C)</h3>
                <p className="text-gray-600 text-sm">
                  Ambient temperature measurements affecting solar panel efficiency
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                <h3 className="font-semibold text-gray-900 mb-2">Humidity (%)</h3>
                <p className="text-gray-600 text-sm">
                  Atmospheric moisture levels impacting solar radiation
                </p>
              </div>
              <div className="bg-teal-50 p-4 rounded-lg border-2 border-teal-200">
                <h3 className="font-semibold text-gray-900 mb-2">Wind Speed (m/s)</h3>
                <p className="text-gray-600 text-sm">
                  Air movement affecting panel cooling and performance
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-300">
                <h3 className="font-semibold text-gray-900 mb-2">Cloud Cover (%)</h3>
                <p className="text-gray-600 text-sm">
                  Sky coverage determining solar radiation intensity
                </p>
              </div>
            </div>
            <p className="text-gray-600 mt-4">
              Historical data spanning multiple years across different geographical
              locations ensures model accuracy and reliability.
            </p>
          </section>

          <section className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center mb-6">
              <Brain className="w-10 h-10 text-sky-600 mr-4" />
              <h2 className="text-3xl font-bold text-gray-900">
                Machine Learning Model
              </h2>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              The predictive model is built using advanced machine learning algorithms
              trained on historical weather data to forecast solar energy output. The
              model undergoes:
            </p>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="bg-sky-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Data Preprocessing</h3>
                  <p className="text-gray-600">
                    Cleaning, normalization, and feature engineering of raw weather
                    data
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-sky-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Model Training</h3>
                  <p className="text-gray-600">
                    Training regression models using supervised learning techniques
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-sky-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Validation & Testing
                  </h3>
                  <p className="text-gray-600">
                    Cross-validation and performance evaluation on test datasets
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-sky-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                  4
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Deployment</h3>
                  <p className="text-gray-600">
                    Integration with Flask API for real-time predictions
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center mb-6">
              <Activity className="w-10 h-10 text-sky-600 mr-4" />
              <h2 className="text-3xl font-bold text-gray-900">System Architecture</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="bg-sky-100 rounded-lg p-4 flex-1 text-center border-2 border-sky-300">
                  <p className="font-semibold text-gray-900">User selects city</p>
                </div>
                <div className="px-4 text-gray-400 text-2xl">→</div>
                <div className="bg-blue-100 rounded-lg p-4 flex-1 text-center border-2 border-blue-300">
                  <p className="font-semibold text-gray-900">
                    Weather API fetches data
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="bg-teal-100 rounded-lg p-4 flex-1 text-center border-2 border-teal-300">
                  <p className="font-semibold text-gray-900">
                    Data sent to Flask API
                  </p>
                </div>
                <div className="px-4 text-gray-400 text-2xl">→</div>
                <div className="bg-green-100 rounded-lg p-4 flex-1 text-center border-2 border-green-300">
                  <p className="font-semibold text-gray-900">
                    ML model predicts output
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
              <p className="text-gray-700">
                <span className="font-semibold">Tech Stack:</span> React (Frontend),
                Flask (Backend), Python (ML), OpenWeatherMap API (Weather Data)
              </p>
            </div>
          </section>

          <section className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl shadow-xl p-8 border-4 border-green-300">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
              Expected Result
            </h2>
            <p className="text-lg text-gray-700 text-center leading-relaxed">
              The system provides accurate predictions of solar energy output measured
              in kilowatt-hours (kWh) based on current weather conditions. This enables
              better planning and optimization of solar power systems.
            </p>
            <div className="mt-6 text-center">
              <p className="text-4xl font-bold text-green-600">
                Predicted Solar Output in kWh
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default About;
