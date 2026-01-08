import { DAYS, MONTHS } from '../constants/api.constants';

/**
 * Builds a formatted date string in Russian
 * @param date - Date object to format
 * @returns Formatted date string
 */
export function buildFormattedDate(date: Date): string {
  const day = DAYS[date.getDay()];
  const dateNumber = date.getDate();
  const month = MONTHS[date.getMonth()];
  const year = date.getFullYear();
  return `${day}, ${dateNumber} ${month} ${year}`;
}
