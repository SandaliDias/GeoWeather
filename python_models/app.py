from flask import Flask, request, jsonify
import joblib
import numpy as np
from datetime import datetime
from flask_cors import CORS
from scipy.spatial.distance import cdist

app = Flask(__name__)
CORS(app)  # To allow CORS requests

# Load the trained machine learning models
models_temp = {}
models_weather = {}
capital_cities = ['Dhaka', 'Thimphu', 'New Delhi', 'Malé', 'Kathmandu', 'Islamabad', 'Colombo', 'Kabul']
for city in capital_cities:
    models_temp[city] = joblib.load(f'weather_predictor_temp_{city}.pkl')
    models_weather[city] = joblib.load(f'weather_predictor_weather_{city}.pkl')

weather_codes = {
    0: "Clear",
    1: "Clouds", 2: "Clouds", 3: "Clouds",
    45: "Fog", 48: "Fog",
    51: "Drizzle", 53: "Drizzle", 55: "Drizzle",
    56: "Drizzle", 57: "Drizzle",
    61: "Rain", 63: "Rain", 65: "Rain",
    66: "Rain", 67: "Rain",
    71: "Snow", 73: "Snow", 75: "Snow", 77: "Snow",
    80: "Rain", 81: "Rain", 82: "Rain",
    85: "Snow", 86: "Snow",
    95: "Thunderstorm", 96: "Thunderstorm", 99: "Thunderstorm"
}

# Define groups of weather codes
weather_groups = {
    "Clear": [0],
    "Clouds": [1, 2, 3],
    "Fog": [45, 48],
    "Drizzle": [51, 53, 55, 56, 57],
    "Rain": [61, 63, 65, 66, 67, 80, 81, 82],
    "Snow": [71, 73, 75, 77, 85, 86],
    "Thunderstorm": [95, 96, 99]
}

# Calculate centroid of each weather group
weather_centroids = {}
for group, codes in weather_groups.items():
    group_codes = [weather_codes[code] for code in codes]
    centroid = np.mean(codes)
    weather_centroids[group] = centroid

def map_weather_code(predicted_code):
    # Find the closest centroid
    min_distance = float('inf')
    closest_group = None

    for group, centroid in weather_centroids.items():
        distance = abs(predicted_code - centroid)
        if distance < min_distance:
            min_distance = distance
            closest_group = group

    return closest_group

@app.route('/predict', methods=['GET'])
def predict():
    date_str = request.args.get('date')
    city = request.args.get('city')
    lat = request.args.get('lat')
    lon = request.args.get('lon')
    
    if not date_str:
        return jsonify({'error': 'No date provided'}), 400
    if not city and (not lat or not lon):
        return jsonify({'error': 'No city or coordinates provided'}), 400

    try:
        # Parse the date and convert it to a suitable format for the model
        date = datetime.strptime(date_str, '%Y-%m-%d')
        date_feature = np.array([[date.timetuple().tm_yday]])
        
        if city:
            temp_model = models_temp[city]
            weather_model = models_weather[city]
        else:
            # Use lat/lon to determine the closest city if necessary
            # For simplicity, we'll assume the city model is selected by some external logic
            city = 'New Delhi'  # Placeholder: replace with actual logic to determine city
            temp_model = models_temp[city]
            weather_model = models_weather[city]
        
        # Predict using the model
        predicted_temp = temp_model.predict(date_feature)
        predicted_weather_code = weather_model.predict(date_feature)
        predicted_weather = map_weather_code(int(predicted_weather_code[0]))

        return jsonify({
            'city': city,
            'predicted_temp': predicted_temp[0],
            'weather': predicted_weather
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=8010, debug=True)
