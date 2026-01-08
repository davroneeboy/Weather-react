import React from 'react';
import { WeatherData } from '../../types/weather.types';
import { buildFormattedDate } from '../../utils/date.util';

interface WeatherDisplayProps {
  weather: WeatherData;
}

/**
 * Weather information display component
 */
export function WeatherDisplay({ weather }: WeatherDisplayProps): React.ReactElement {
  const formattedDate = buildFormattedDate(new Date());
  const temperature = Math.round(weather.main.temp);
  const weatherCondition = weather.weather[0]?.main || '';

  return (
    <div>
      <div className="location-box">
        <div className="location">
          {weather.name}, {weather.sys.country}
        </div>
        <div className="date">{formattedDate}</div>
      </div>
      <div className="weather-box">
        <div className="temp">{temperature}°c</div>
        <div className="weather">{weatherCondition}</div>
      </div>
    </div>
  );
}
