"""
SOLAR ENERGY OUTPUT PREDICTION - FLASK BACKEND

This is a simple Flask API example for the ML team to modify.
Replace the dummy logic with your trained machine learning model.

Setup Instructions:
1. Install Flask: pip install flask flask-cors
2. Run this file: python backend_example.py
3. The API will be available at http://localhost:5000

API Endpoint:
POST /predict
Body: {
    "temperature": float,
    "humidity": float,
    "wind_speed": float,
    "cloud_cover": float
}
Response: {
    "solar_output": float
}
"""

from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route("/predict", methods=["POST"])
def predict():
    """
    Predict solar energy output based on weather data.

    Replace this dummy calculation with your trained ML model.
    Example:
        model = load_model('your_model.pkl')
        prediction = model.predict([[temperature, humidity, wind_speed, cloud_cover]])
    """
    try:
        data = request.json

        temperature = data["temperature"]
        humidity = data["humidity"]
        wind_speed = data["wind_speed"]
        cloud_cover = data["cloud_cover"]

        # DUMMY LOGIC - Replace with your ML model
        # This is a simple weighted calculation for demonstration
        solar_output = (
            (temperature * 0.3) -
            (cloud_cover * 0.2) +
            (wind_speed * 0.1) -
            (humidity * 0.05)
        )

        # Ensure output is not negative
        solar_output = max(0, solar_output)

        return jsonify({
            "solar_output": round(solar_output, 2)
        })

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 400


@app.route("/health", methods=["GET"])
def health():
    """Health check endpoint"""
    return jsonify({
        "status": "running",
        "message": "Solar prediction API is working"
    })


if __name__ == "__main__":
    print("=" * 60)
    print("SOLAR ENERGY OUTPUT PREDICTION API")
    print("=" * 60)
    print("Server running on http://localhost:5000")
    print("\nAvailable endpoints:")
    print("  POST /predict - Get solar output prediction")
    print("  GET  /health  - Check API health")
    print("\nReplace the dummy logic with your ML model!")
    print("=" * 60)
    app.run(debug=True, port=5000)
