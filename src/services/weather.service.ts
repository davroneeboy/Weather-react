import { WeatherData, WeatherApiConfig } from '../types/weather.types';
import { OPEN_METEO_BASE, GEOCODING_API } from '../constants/api.constants';

interface OpenMeteoGeocodingResponse {
  results?: Array<{
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    country: string;
    admin1?: string;
  }>;
}

interface OpenMeteoWeatherResponse {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    surface_pressure: number;
    weather_code: number;
  };
  daily: {
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    sunrise: string[];
    sunset: string[];
  };
}

/**
 * Service for fetching weather data from weather APIs
 */
export class WeatherService {
  private readonly config: WeatherApiConfig;

  constructor(config: WeatherApiConfig) {
    this.config = config;
  }

  /**
   * Fetches weather data for a given city using OpenWeatherMap API
   * @param cityName - Name of the city to get weather for
   * @returns Promise with weather data or error
   */
  private async fetchFromOpenWeather(cityName: string): Promise<WeatherData> {
    const url = `${this.config.base}weather?q=${encodeURIComponent(cityName)}&units=metric&APPID=${this.config.key}`;
    const response = await fetch(url);
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Неверный API ключ. Проверьте настройки.');
      }
      if (response.status === 404) {
        throw new Error('Город не найден. Попробуйте другой город.');
      }
      throw new Error('Ошибка запроса к API');
    }
    const data: WeatherData = await response.json();
    if (data.cod === '404' || data.cod === 404) {
      throw new Error('Город не найден. Попробуйте другой город.');
    }
    return data;
  }

  /**
   * Fetches weather data for a given city using Open-Meteo API (free, no key required)
   * @param cityName - Name of the city to get weather for
   * @returns Promise with weather data or error
   */
  private async fetchFromOpenMeteo(cityName: string): Promise<WeatherData> {
    const geocodingUrl = `${GEOCODING_API}?name=${encodeURIComponent(cityName)}&count=1&language=ru&format=json`;
    const geocodingResponse = await fetch(geocodingUrl);
    
    if (!geocodingResponse.ok) {
      throw new Error('Ошибка при поиске города');
    }

    const geocodingData: OpenMeteoGeocodingResponse = await geocodingResponse.json();
    
    if (!geocodingData.results || geocodingData.results.length === 0) {
      throw new Error('Город не найден. Попробуйте другой город.');
    }

    const location = geocodingData.results[0];
    const { latitude, longitude } = location;

    const weatherUrl = `${OPEN_METEO_BASE}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,surface_pressure,weather_code&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto&forecast_days=1`;
    const weatherResponse = await fetch(weatherUrl);

    if (!weatherResponse.ok) {
      throw new Error('Ошибка при получении данных о погоде');
    }

    const weatherData: OpenMeteoWeatherResponse = await weatherResponse.json();
    const current = weatherData.current;
    const daily = weatherData.daily;

    const weatherCodeToCondition = (code: number): { main: string; description: string; icon: string } => {
      if (code === 0) return { main: 'Clear', description: 'Ясно', icon: '01d' };
      if (code <= 3) return { main: 'Clouds', description: 'Облачно', icon: '02d' };
      if (code <= 49) return { main: 'Fog', description: 'Туман', icon: '50d' };
      if (code <= 59) return { main: 'Drizzle', description: 'Моросящий дождь', icon: '09d' };
      if (code <= 69) return { main: 'Rain', description: 'Дождь', icon: '10d' };
      if (code <= 79) return { main: 'Snow', description: 'Снег', icon: '13d' };
      if (code <= 84) return { main: 'Rain', description: 'Ливень', icon: '09d' };
      if (code <= 86) return { main: 'Snow', description: 'Снегопад', icon: '13d' };
      if (code <= 99) return { main: 'Thunderstorm', description: 'Гроза', icon: '11d' };
      return { main: 'Clear', description: 'Ясно', icon: '01d' };
    };

    const condition = weatherCodeToCondition(current.weather_code);
    const sunriseTime = new Date(daily.sunrise[0]).getTime() / 1000;
    const sunsetTime = new Date(daily.sunset[0]).getTime() / 1000;

    const convertedData: WeatherData = {
      name: location.name,
      main: {
        temp: current.temperature_2m,
        feels_like: current.temperature_2m,
        temp_min: daily.temperature_2m_min[0],
        temp_max: daily.temperature_2m_max[0],
        pressure: Math.round(current.surface_pressure),
        humidity: current.relative_humidity_2m,
      },
      sys: {
        country: location.country,
        sunrise: sunriseTime,
        sunset: sunsetTime,
      },
      weather: [
        {
          id: current.weather_code,
          main: condition.main,
          description: condition.description,
          icon: condition.icon,
        },
      ],
      cod: 200,
    };

    return convertedData;
  }

  /**
   * Fetches weather data for a given city
   * @param cityName - Name of the city to get weather for
   * @returns Promise with weather data or error
   */
  async fetchWeatherByCity(cityName: string): Promise<WeatherData> {
    if (this.config.provider === 'openmeteo') {
      return this.fetchFromOpenMeteo(cityName);
    }
    
    if (!this.config.key) {
      throw new Error('API ключ не настроен. Переключитесь на Open-Meteo (бесплатно, без ключа) или настройте REACT_APP_API_KEY в .env файле.');
    }
    
    return this.fetchFromOpenWeather(cityName);
  }
}
