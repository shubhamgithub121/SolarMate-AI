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

# ── Load ML model & scaler (optional — fallback formula used if missing) ───────
try:
    model  = pickle.load(open("model.pkl",  "rb"))
    scaler = pickle.load(open("scaler.pkl", "rb"))
    print("✅ Model aur scaler load ho gaye!")
    MODEL_AVAILABLE = True
except Exception as e:
    print(f"⚠️  Model load nahi hua ({e}) — fallback formula use hogi.")
    model  = None
    scaler = None
    MODEL_AVAILABLE = False


# ── Feature engineering for ML model ──────────────────────────────────────────
def build_features(temperature, humidity, wind_speed, cloud_cover):
    now = datetime.now()

    temperature_val = float(np.clip(temperature, -10, 50))
    pressure        = 0.0          # deviation from baseline — not absolute hPa
    humidity_val    = float(np.clip(humidity,    0, 100))
    wind_direction  = 180.0
    speed           = float(np.clip(wind_speed,  0,  20))

    day     = float(now.day)
    month   = float(now.month)
    weekday = float(now.weekday())

    # UNIXTime anchored to training-era baseline (2016)
    base_unix   = 1472688000.0
    time_of_day = float(now.hour * 3600 + now.minute * 60 + now.second)
    unix_time   = base_unix + time_of_day

    # Radiation estimate from cloud cover + time-of-day sun angle
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
        rad_ewma12,
    ]], dtype=np.float64)

    names = [
        'Temperature', 'Pressure', 'Humidity', 'WindDirection', 'Speed',
        'day', 'month', 'weekday', 'UNIXTime',
        'Radiation_lag1', 'Radiation_lag2', 'rad_rolling3',
        'temp_humidity', 'rad_ewma12',
    ]
    print("✅ Features built:")
    for n, v in zip(names, features[0]):
        print(f"   {n}: {v:.4f}")

    return features


# ── Fallback formula (used when model.pkl is unavailable) ─────────────────────
def fallback_formula(temperature, humidity, wind_speed, cloud_cover):
    """
    Physics-inspired estimate (kWh):
    - Base = 8 peak sun hours (India average)
    - Panel efficiency drops ~0.4 %/degC above 25 degC
    - Cloud cover is the dominant reduction factor
    - Humidity adds a modest reduction
    - Wind provides a small cooling efficiency bonus
    """
    base         = 8.0
    temp_penalty = max(0.0, (temperature - 25) * 0.004)
    temp_factor  = 1.0 - temp_penalty
    cloud_factor = 1.0 - (cloud_cover / 100) * 0.90
    humid_factor = 1.0 - (humidity    / 100) * 0.10
    wind_bonus   = min(wind_speed * 0.005, 0.03)

    result = base * temp_factor * cloud_factor * humid_factor * (1 + wind_bonus)
    return max(0.0, round(result, 2))


# ── /predict endpoint ──────────────────────────────────────────────────────────
@app.route("/predict", methods=["POST", "OPTIONS"])
def predict():
    # Handle CORS preflight
    if request.method == "OPTIONS":
        resp = jsonify({"status": "ok"})
        resp.headers.add("Access-Control-Allow-Origin",  "*")
        resp.headers.add("Access-Control-Allow-Headers", "Content-Type")
        resp.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
        return resp, 200

    try:
        data = request.get_json(force=True, silent=True)
        if not data:
            return jsonify({"error": "JSON body nahi mila"}), 400

        # Validate required fields
        required = ["temperature", "humidity", "wind_speed", "cloud_cover"]
        missing  = [f for f in required if f not in data]
        if missing:
            return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400

        temperature = float(data["temperature"])
        humidity    = float(data["humidity"])
        wind_speed  = float(data["wind_speed"])
        cloud_cover = float(data["cloud_cover"])

        # Route to ML model OR fallback formula
        if MODEL_AVAILABLE:
            features     = build_features(temperature, humidity, wind_speed, cloud_cover)
            scaled       = scaler.transform(features)
            print(f"✅ Scaled features: {scaled}")
            raw          = model.predict(scaled)
            solar_output = max(0.0, round(float(raw[0]), 2))
            print(f"✅ ML Prediction: {solar_output} kWh")
        else:
            solar_output = fallback_formula(temperature, humidity, wind_speed, cloud_cover)
            print(f"✅ Fallback Prediction: {solar_output} kWh")

        return jsonify({"solar_output": solar_output}), 200

    except KeyError as e:
        return jsonify({"error": f"Field missing: {e}"}), 400
    except ValueError as e:
        return jsonify({"error": f"Invalid numeric value: {e}"}), 422
    except Exception as e:
        print(f"❌ Prediction error: {e}")
        return jsonify({"error": str(e)}), 500


# ── Health check ───────────────────────────────────────────────────────────────
@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "status": "Solar Predictor Backend chal raha hai!",
        "model_loaded": MODEL_AVAILABLE,
    })


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)