import { WeatherData } from '../types/weather.types';
import { TEMPERATURE_THRESHOLD } from '../constants/api.constants';

/**
 * Extracts error message from unknown error type
 * @param error - Unknown error object
 * @param defaultMessage - Default message if error is not an Error instance
 * @returns Error message string
 */
export function extractErrorMessage(error: unknown, defaultMessage: string): string {
  if (error instanceof Error) {
    return error.message;
  }
  return defaultMessage;
}

/**
 * Checks if weather data is valid and contains main temperature data
 * @param weather - Weather data object
 * @returns True if weather data is valid
 */
export function isValidWeatherData(weather: WeatherData | Record<string, never>): weather is WeatherData {
  return typeof weather === 'object' && weather !== null && 'main' in weather && typeof weather.main === 'object' && weather.main !== null && 'temp' in weather.main;
}

/**
 * Determines if the temperature is warm based on threshold
 * @param temperature - Temperature in Celsius
 * @returns True if temperature is above threshold
 */
export function isWarmTemperature(temperature: number): boolean {
  return temperature > TEMPERATURE_THRESHOLD;
}

/**
 * Gets the CSS class name based on weather temperature
 * @param weather - Weather data object
 * @returns CSS class name ('app warm' or 'app')
 */
export function getWeatherClassName(weather: WeatherData | Record<string, never>): string {
  if (!isValidWeatherData(weather)) {
    return 'app';
  }
  return isWarmTemperature(weather.main.temp) ? 'app warm' : 'app';
}
