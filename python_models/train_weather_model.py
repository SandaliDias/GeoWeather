import requests
import pandas as pd
from sklearn.linear_model import LinearRegression
import joblib

def fetch_weather_data(lat, lon, start_date, end_date):
    url = f"https://archive-api.open-meteo.com/v1/archive?latitude={lat}&longitude={lon}&start_date={start_date}&end_date={end_date}&daily=temperature_2m_max,temperature_2m_min&timezone=UTC"
    response = requests.get(url)
    data = response.json()
    return data['daily']

def prepare_data(data):
    df = pd.DataFrame(data)
    df['date'] = pd.to_datetime(df['time'])
    df['temp_max'] = df['temperature_2m_max']
    df['temp_min'] = df['temperature_2m_min']
    return df[['date', 'temp_max', 'temp_min']]

def train_model(df):
    df['day_of_year'] = df['date'].dt.dayofyear
    X = df[['day_of_year']]
    y = df['temp_max']
    model = LinearRegression()
    model.fit(X, y)
    joblib.dump(model, 'weather_predictor.pkl')

if __name__ == "__main__":
    lat, lon = 6.94, 79.85
    start_date, end_date = "2023-06-01", "2023-06-10"
    weather_data = fetch_weather_data(lat, lon, start_date, end_date)
    prepared_data = prepare_data(weather_data)
    train_model(prepared_data)
