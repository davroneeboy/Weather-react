import { WeatherData, WeatherApiConfig } from '../types/weather.types';

/**
 * Service for fetching weather data from OpenWeatherMap API
 */
export class WeatherService {
  private readonly config: WeatherApiConfig;

  constructor(config: WeatherApiConfig) {
    this.config = config;
  }

  /**
   * Fetches weather data for a given city
   * @param cityName - Name of the city to get weather for
   * @returns Promise with weather data or error
   */
  async fetchWeatherByCity(cityName: string): Promise<WeatherData> {
    const url = `${this.config.base}weather?q=${encodeURIComponent(cityName)}&units=metric&APPID=${this.config.key}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Ошибка запроса');
    }
    const data: WeatherData = await response.json();
    if (data.cod === '404' || data.cod === 404) {
      throw new Error('Город не найден. Попробуйте другой город.');
    }
    return data;
  }
}
