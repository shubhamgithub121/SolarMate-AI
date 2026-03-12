from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
from datetime import datetime
import math

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}},
     methods=["GET", "POST", "OPTIONS"],
     allow_headers=["Content-Type"])

try:
    model = pickle.load(open("model.pkl", "rb"))
    scaler = pickle.load(open("scaler.pkl", "rb"))
    print("✅ Model aur scaler load ho gaye!")
except Exception as e:
    print(f"❌ Model load nahi hua: {e}")
    model = None
    scaler = None


def build_features(temperature, humidity, wind_speed, cloud_cover):
    now = datetime.now()

    temperature_val = float(np.clip(temperature, -10, 50))

    # ✅ KEY FIX: Pressure = 0.0
    # Training mein pressure deviation se tha, absolute value nahi
    # 1013.25 dene se lambda=103 ke saath OVERFLOW hota tha
    pressure = 0.0

    humidity_val   = float(np.clip(humidity, 0, 100))
    wind_direction = 180.0
    speed          = float(np.clip(wind_speed, 0, 20))

    day     = float(now.day)
    month   = float(now.month)
    weekday = float(now.weekday())

    # UNIXTime - training 2016 era ka tha
    base_unix   = 1472688000.0
    time_of_day = float(now.hour * 3600 + now.minute * 60 + now.second)
    unix_time   = base_unix + time_of_day

    # Radiation estimate
    hour       = now.hour
    sun_angle  = math.sin(math.pi * (hour - 6) / 12) if 6 <= hour <= 18 else 0.0
    cloud_frac = float(cloud_cover) / 100.0
    base_rad   = float(np.clip(600.0 * (1.0 - cloud_frac) * sun_angle, 0, 1000))

    radiation_lag1 = float(base_rad * 0.95)
    radiation_lag2 = float(base_rad * 0.90)
    rad_rolling3   = float(base_rad * 0.92)
    rad_ewma12     = float(base_rad * 0.93)
    temp_humidity  = float(np.clip(temperature_val * humidity_val, 0, 4000))

    features = np.array([[
        temperature_val,
        pressure,
        humidity_val,
        wind_direction,
        speed,
        day,
        month,
        weekday,
        unix_time,
        radiation_lag1,
        radiation_lag2,
        rad_rolling3,
        temp_humidity,
        rad_ewma12
    ]], dtype=np.float64)

    names = ['Temperature','Pressure','Humidity','WindDirection','Speed',
             'day','month','weekday','UNIXTime','Radiation_lag1',
             'Radiation_lag2','rad_rolling3','temp_humidity','rad_ewma12']
    print("✅ Features:")
    for n, v in zip(names, features[0]):
        print(f"   {n}: {v:.4f}")

    return features


@app.route("/predict", methods=["POST", "OPTIONS"])
def predict():
    if request.method == "OPTIONS":
        response = jsonify({"status": "ok"})
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type")
        response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
        return response, 200

    try:
        data = request.json
        if not data:
            return jsonify({"error": "JSON data nahi mili"}), 400

        temperature = data["temperature"]
        humidity    = data["humidity"]
        wind_speed  = data["wind_speed"]
        cloud_cover = data["cloud_cover"]

        features = build_features(temperature, humidity, wind_speed, cloud_cover)
        scaled   = scaler.transform(features)

        print(f"✅ Scaled: {scaled}")

        prediction   = model.predict(scaled)
        solar_output = float(prediction[0])
        solar_output = max(0.0, round(solar_output, 2))

        print(f"✅ Prediction: {solar_output} kWh")
        return jsonify({"solar_output": solar_output})

    except KeyError as e:
        return jsonify({"error": f"Field missing: {e}"}), 400
    except Exception as e:
        print(f"❌ Prediction error: {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/", methods=["GET"])
def home():
    return jsonify({"status": "✅ Solar Predictor Backend chal raha hai!"})


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)