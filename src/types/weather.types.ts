export interface WeatherMain {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
}

export interface WeatherSys {
  country: string;
  sunrise: number;
  sunset: number;
}

export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface WeatherData {
  name: string;
  main: WeatherMain;
  sys: WeatherSys;
  weather: WeatherCondition[];
  cod: string | number;
  message?: string;
}

export interface WeatherApiConfig {
  key: string;
  base: string;
  provider?: 'openweather' | 'openmeteo';
}

export interface SearchParams {
  query: string;
}

export interface OpenMeteoWeatherData {
  name: string;
  main: WeatherMain;
  sys: WeatherSys;
  weather: WeatherCondition[];
  cod: string | number;
}
