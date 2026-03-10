import { Link } from 'react-router-dom';
import { Sun, Zap, TrendingUp, Users } from 'lucide-react';

function Home() {
  const teamMembers = [
    {
      name: 'Rahul Sharma',
      role: 'ML Engineer',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1',
    },
    {
      name: 'Priya Patel',
      role: 'Data Scientist',
      image: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1',
    },
    {
      name: 'Arjun Mehta',
      role: 'Backend Developer',
      image: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1',
    },
    {
      name: 'Ananya Singh',
      role: 'Frontend Developer',
      image: 'https://images.pexels.com/photos/3756681/pexels-photo-3756681.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Sun className="w-20 h-20 text-yellow-500" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Solar Energy Output Prediction
            <br />
            <span className="text-sky-600">Using Machine Learning</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            This system predicts solar energy output based on real-time weather data
            using a trained machine learning model.
          </p>
          <div className="relative w-full h-96 rounded-2xl overflow-hidden shadow-2xl mb-12">
            <img
              src="https://images.pexels.com/photos/433308/pexels-photo-433308.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="Solar Panels"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end justify-center pb-8">
              <Link
                to="/calculator"
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-8 py-4 rounded-full shadow-lg transition-all transform hover:scale-105"
              >
                Try Solar Calculator
              </Link>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            Project Overview
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex justify-center mb-4">
                <Zap className="w-12 h-12 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
                Renewable Energy
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Solar energy is a clean, renewable power source that reduces carbon
                emissions and helps combat climate change. It's crucial for
                sustainable development and energy independence.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex justify-center mb-4">
                <Sun className="w-12 h-12 text-yellow-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
                Solar Power Generation
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Solar panels convert sunlight into electricity through photovoltaic
                cells. The efficiency depends on various factors including weather
                conditions, panel orientation, and local climate.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex justify-center mb-4">
                <TrendingUp className="w-12 h-12 text-sky-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
                Output Prediction
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Predicting solar output helps optimize energy storage, grid
                management, and resource allocation. Machine learning enables
                accurate forecasts based on weather patterns.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <div className="flex items-center justify-center mb-8">
            <Users className="w-8 h-8 text-gray-700 mr-3" />
            <h2 className="text-4xl font-bold text-gray-900">Team Members</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 text-center"
              >
                <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-sky-200">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-sky-600 font-medium">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
