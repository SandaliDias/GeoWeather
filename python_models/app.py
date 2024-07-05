from flask import Flask, request, jsonify
import joblib
import numpy as np
from datetime import datetime
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # To allow CORS requests

# Load the trained machine learning model
model = joblib.load('weather_predictor.pkl')

@app.route('/predict', methods=['GET'])
def predict():
    date_str = request.args.get('date')
    if not date_str:
        return jsonify({'error': 'No date provided'}), 400

    try:
        # Parse the date and convert it to a suitable format for the model
        date = datetime.strptime(date_str, '%Y-%m-%d')
        date_feature = np.array([[date.timetuple().tm_yday]])
        print(date_feature)
        # Predict using the model
        predicted_temp = model.predict(date_feature)
        print(predicted_temp[0])
        return jsonify({'predicted_temp': predicted_temp[0]})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=8010, debug=True)
