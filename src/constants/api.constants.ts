export const API_CONFIG = {
  key: process.env.REACT_APP_API_KEY || '',
  base: process.env.REACT_APP_API_BASE || 'https://api.openweathermap.org/data/2.5/',
} as const;

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
