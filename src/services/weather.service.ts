import { WeatherData, WeatherApiConfig, ForecastDay } from '../types/weather.types';
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
    wind_speed_10m?: number;
    wind_direction_10m?: number;
  };
  daily: {
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    sunrise: string[];
    sunset: string[];
    weather_code: number[];
  };
}

interface WttrResponse {
  location: {
    name: string;
    country: string;
  };
  current: {
    temp_c: number;
    feelslike_c: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    humidity: number;
    pressure_mb: number;
    wind_kph: number;
    wind_deg: number;
    vis_km: number;
  };
  forecast: {
    forecastday: Array<{
      date: string;
      day: {
        maxtemp_c: number;
        mintemp_c: number;
        condition: {
          text: string;
          icon: string;
          code: number;
        };
      };
    }>;
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
   * Fetches weather data using wttr.in API (free, no key required)
   * @param cityName - Name of the city to get weather for
   * @returns Promise with weather data or error
   */
  private async fetchFromWttr(cityName: string): Promise<WeatherData> {
    const url = `https://wttr.in/${encodeURIComponent(cityName)}?format=j1&lang=ru`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Ошибка при получении данных о погоде');
    }

    const data: WttrResponse = await response.json();
    const current = data.current;
    const location = data.location;
    const forecastDay = data.forecast.forecastday[0];

    const weatherCodeToCondition = (code: number): { main: string; description: string; icon: string } => {
      if (code === 1000) return { main: 'Clear', description: 'Ясно', icon: '01d' };
      if (code <= 1003) return { main: 'Clouds', description: 'Облачно', icon: '02d' };
      if (code <= 1006) return { main: 'Clouds', description: 'Пасмурно', icon: '03d' };
      if (code <= 1030) return { main: 'Fog', description: 'Туман', icon: '50d' };
      if (code <= 1063 || code <= 1087) return { main: 'Rain', description: 'Дождь', icon: '10d' };
      if (code <= 1114 || code <= 1117) return { main: 'Snow', description: 'Снег', icon: '13d' };
      if (code <= 1147) return { main: 'Fog', description: 'Туман', icon: '50d' };
      if (code <= 1201 || code <= 1204) return { main: 'Rain', description: 'Дождь', icon: '09d' };
      if (code <= 1210 || code <= 1225) return { main: 'Snow', description: 'Снег', icon: '13d' };
      if (code <= 1237) return { main: 'Snow', description: 'Град', icon: '13d' };
      if (code <= 1261 || code <= 1264) return { main: 'Snow', description: 'Снег', icon: '13d' };
      if (code <= 1273 || code <= 1276) return { main: 'Thunderstorm', description: 'Гроза', icon: '11d' };
      if (code <= 1282) return { main: 'Thunderstorm', description: 'Гроза', icon: '11d' };
      return { main: 'Clear', description: 'Ясно', icon: '01d' };
    };

    const condition = weatherCodeToCondition(current.condition.code);
    const now = new Date();
    const sunrise = new Date(now);
    sunrise.setHours(6, 0, 0, 0);
    const sunset = new Date(now);
    sunset.setHours(18, 0, 0, 0);

    const convertedData: WeatherData = {
      name: location.name,
      main: {
        temp: current.temp_c,
        feels_like: current.feelslike_c,
        temp_min: forecastDay.day.mintemp_c,
        temp_max: forecastDay.day.maxtemp_c,
        pressure: Math.round(current.pressure_mb),
        humidity: current.humidity,
      },
      sys: {
        country: location.country,
        sunrise: sunrise.getTime() / 1000,
        sunset: sunset.getTime() / 1000,
      },
      weather: [
        {
          id: current.condition.code,
          main: condition.main,
          description: current.condition.text,
          icon: condition.icon,
        },
      ],
      wind: {
        speed: current.wind_kph / 3.6,
        deg: current.wind_deg,
      },
      visibility: current.vis_km * 1000,
      clouds: {
        all: 0,
      },
      cod: 200,
    };

    return convertedData;
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

    const weatherUrl = `${OPEN_METEO_BASE}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,surface_pressure,weather_code,wind_speed_10m,wind_direction_10m&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,weather_code&timezone=auto&forecast_days=7`;
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
      wind: {
        speed: (current.wind_speed_10m || 0) * 3.6,
        deg: current.wind_direction_10m || 0,
      },
      visibility: 10000,
      clouds: {
        all: 0,
      },
      cod: 200,
    };

    return convertedData;
  }

  /**
   * Fetches weather forecast for multiple days
   * @param cityName - Name of the city
   * @returns Promise with forecast data
   */
  async fetchForecast(cityName: string): Promise<ForecastDay[]> {
    if (this.config.provider === 'openmeteo') {
      return this.fetchForecastFromOpenMeteo(cityName);
    }
    return [];
  }

  /**
   * Fetches forecast from Open-Meteo
   */
  private async fetchForecastFromOpenMeteo(cityName: string): Promise<ForecastDay[]> {
    const geocodingUrl = `${GEOCODING_API}?name=${encodeURIComponent(cityName)}&count=1&language=ru&format=json`;
    const geocodingResponse = await fetch(geocodingUrl);
    
    if (!geocodingResponse.ok) {
      return [];
    }

    const geocodingData: OpenMeteoGeocodingResponse = await geocodingResponse.json();
    
    if (!geocodingData.results || geocodingData.results.length === 0) {
      return [];
    }

    const location = geocodingData.results[0];
    const { latitude, longitude } = location;

    const weatherUrl = `${OPEN_METEO_BASE}?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto&forecast_days=7`;
    const weatherResponse = await fetch(weatherUrl);

    if (!weatherResponse.ok) {
      return [];
    }

    const weatherData: OpenMeteoWeatherResponse = await weatherResponse.json();
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

    const forecast: ForecastDay[] = [];
    for (let i = 0; i < Math.min(7, daily.temperature_2m_max.length); i++) {
      const condition = weatherCodeToCondition(daily.weather_code[i]);
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      forecast.push({
        date: date.toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric', month: 'short' }),
        temp_min: Math.round(daily.temperature_2m_min[i]),
        temp_max: Math.round(daily.temperature_2m_max[i]),
        icon: condition.icon,
        description: condition.description,
        main: condition.main,
      });
    }

    return forecast;
  }

  /**
   * Fetches weather data for a given city
   * @param cityName - Name of the city to get weather for
   * @returns Promise with weather data or error
   */
  async fetchWeatherByCity(cityName: string): Promise<WeatherData> {
    if (this.config.provider === 'wttr') {
      return this.fetchFromWttr(cityName);
    }
    
    if (this.config.provider === 'openmeteo') {
      return this.fetchFromOpenMeteo(cityName);
    }
    
    if (!this.config.key) {
      throw new Error('API ключ не настроен. Переключитесь на Open-Meteo или wttr (бесплатно, без ключа) или настройте REACT_APP_API_KEY в .env файле.');
    }
    
    return this.fetchFromOpenWeather(cityName);
  }
}
