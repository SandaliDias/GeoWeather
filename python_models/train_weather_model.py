import requests
import pandas as pd
from sklearn.linear_model import LinearRegression
import joblib
from datetime import datetime, timedelta

def fetch_weather_data(lat, lon, start_date, end_date):
    url = f"https://archive-api.open-meteo.com/v1/archive?latitude={lat}&longitude={lon}&start_date={start_date}&end_date={end_date}&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=UTC"
    response = requests.get(url)
    data = response.json()
    
    if 'daily' in data:
        return data['daily']
    else:
        raise ValueError("Unexpected data format received from API")

def prepare_data(data):
    # Ensure data is in the correct format
    if 'time' not in data or 'temperature_2m_max' not in data or 'temperature_2m_min' not in data or 'weather_code' not in data:
        raise ValueError("Missing expected keys in data")
    
    df = pd.DataFrame(data)
    df['date'] = pd.to_datetime(df['time'])
    df['temp_max'] = df['temperature_2m_max']
    df['temp_min'] = df['temperature_2m_min']
    df['weather'] = df['weather_code']
    return df[['date', 'temp_max', 'temp_min', 'weather']]

def train_model(df, city_name):
    df['day_of_year'] = df['date'].dt.dayofyear
    X = df[['day_of_year']]
    y_temp = df['temp_max']
    y_weather = df['weather']

    model_temp = LinearRegression()
    model_temp.fit(X, y_temp)
    joblib.dump(model_temp, f'weather_predictor_temp_{city_name}.pkl')

    model_weather = LinearRegression()
    model_weather.fit(X, y_weather)
    joblib.dump(model_weather, f'weather_predictor_weather_{city_name}.pkl')

if __name__ == "__main__":
    end_date = datetime.now() - timedelta(days = 5)
    start_date = end_date - timedelta(days=365)
    start_date_str = start_date.strftime('%Y-%m-%d')
    end_date_str = end_date.strftime('%Y-%m-%d')

    capital_cities = {
        'Dhaka': (23.8103, 90.4125),
        'Thimphu': (27.4728, 89.6390),
        'New Delhi': (28.6139, 77.2090),
        'Malé': (4.1755, 73.5093),
        'Kathmandu': (27.7172, 85.3240),
        'Islamabad': (33.6844, 73.0479),
        'Colombo': (6.9271, 79.8612),
        'Kabul': (34.5553, 69.2075),
    }

    for city, (lat, lon) in capital_cities.items():
        try:
            weather_data = fetch_weather_data(lat, lon, start_date_str, end_date_str)
            prepared_data = prepare_data(weather_data)
            train_model(prepared_data, city)
            print(f"Model trained and saved for {city}")
        except Exception as e:
            print(f"Failed to process data for {city}: {e}")
