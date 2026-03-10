import { Link, useLocation } from 'react-router-dom';
import { Sun } from 'lucide-react';

function Navbar() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80">
            <Sun className="w-8 h-8 text-yellow-500" />
            <span className="text-xl font-bold text-gray-900">
              Solar Predictor
            </span>
          </Link>

          <div className="flex space-x-1">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                isActive('/')
                  ? 'bg-sky-600 text-white'
                  : 'text-gray-700 hover:bg-sky-50'
              }`}
            >
              Home
            </Link>
            <Link
              to="/calculator"
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                isActive('/calculator')
                  ? 'bg-sky-600 text-white'
                  : 'text-gray-700 hover:bg-sky-50'
              }`}
            >
              Calculator
            </Link>
            <Link
              to="/about"
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                isActive('/about')
                  ? 'bg-sky-600 text-white'
                  : 'text-gray-700 hover:bg-sky-50'
              }`}
            >
              About
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
