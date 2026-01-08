const getDefaultProvider = (): 'openweather' | 'openmeteo' | 'wttr' => {
  const envProvider = process.env.REACT_APP_API_PROVIDER as 'openweather' | 'openmeteo' | 'wttr' | undefined;
  if (envProvider) {
    return envProvider;
  }
  const hasApiKey = process.env.REACT_APP_API_KEY && process.env.REACT_APP_API_KEY.trim() !== '';
  return hasApiKey ? 'openweather' : 'openmeteo';
};

export const API_CONFIG = {
  key: process.env.REACT_APP_API_KEY || '',
  base: process.env.REACT_APP_API_BASE || 'https://api.openweathermap.org/data/2.5/',
  provider: getDefaultProvider(),
} as const;

export const OPEN_METEO_BASE = 'https://api.open-meteo.com/v1/forecast';
export const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';

export const TEMPERATURE_THRESHOLD = 16;

export const MONTHS = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
] as const;

export const DAYS = [
  'Воскресенье',
  'Понедельник',
  'Вторник',
  'Среда',
  'Четверг',
  'Пятница',
  'Суббота',
] as const;
