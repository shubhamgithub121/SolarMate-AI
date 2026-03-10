# Solar Energy Output Prediction Using Machine Learning

A modern web application that predicts solar energy output based on real-time weather data using machine learning.

## Features

- **Real-time Weather Data**: Fetches current weather conditions from OpenWeatherMap API
- **ML-based Predictions**: Predicts solar energy output using weather parameters
- **Interactive UI**: Clean, responsive interface built with React
- **Multiple Cities**: Support for Delhi, Mumbai, Bangalore, and Jaipur

## Tech Stack

### Frontend
- React 18
- Vite
- React Router DOM
- Tailwind CSS
- Lucide React (icons)

### Backend
- Flask (Python)
- Flask-CORS

## Project Structure

```
src/
├── components/
│   └── Navbar.jsx          # Navigation component
├── pages/
│   ├── Home.jsx           # Landing page
│   ├── Calculator.jsx     # Solar prediction calculator
│   └── About.jsx          # Project information
├── App.tsx                # Main app with routing
├── main.tsx              # Entry point
└── index.css             # Global styles

backend_example.py         # Flask API example
```

## Installation & Setup

### Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Backend Setup

1. Install Python dependencies:
```bash
pip install flask flask-cors
```

2. Run the Flask server:
```bash
python backend_example.py
```

The API will be available at `http://localhost:5000`

## Weather API Setup

1. Get a free API key from [OpenWeatherMap](https://openweathermap.org/api)
2. Replace `YOUR_WEATHER_API_KEY` in `src/pages/Calculator.jsx` with your actual API key

**Note**: The app includes fallback demo data if the API is not configured.

## Usage

1. **Home Page**: Overview of the project and team members
2. **Calculator Page**:
   - Select a city from the dropdown
   - Weather data is automatically fetched
   - Click "Generate Solar Output" to get prediction
   - View predicted solar energy in kWh
3. **About Page**: Detailed project information and architecture

## Machine Learning Integration

The current backend (`backend_example.py`) uses a simple dummy calculation. To integrate your ML model:

1. Train your model using historical weather data
2. Save your model (e.g., using pickle or joblib)
3. Replace the dummy logic in `backend_example.py`:

```python
# Load your model
import pickle
model = pickle.load(open('solar_model.pkl', 'rb'))

# In the predict function:
features = [[temperature, humidity, wind_speed, cloud_cover]]
solar_output = model.predict(features)[0]
```

## API Endpoints

### POST /predict
Predict solar energy output based on weather data.

**Request Body:**
```json
{
  "temperature": 28.5,
  "humidity": 65,
  "wind_speed": 3.5,
  "cloud_cover": 30
}
```

**Response:**
```json
{
  "solar_output": 7.85
}
```

### GET /health
Check if the API is running.

**Response:**
```json
{
  "status": "running",
  "message": "Solar prediction API is working"
}
```

## Building for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

## Team

- **Rahul Sharma** - ML Engineer
- **Priya Patel** - Data Scientist
- **Arjun Mehta** - Backend Developer
- **Ananya Singh** - Frontend Developer

## License

This is a college project for educational purposes.
