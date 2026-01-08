import React from 'react';
import { ForecastDay } from '../../types/weather.types';

interface ForecastProps {
  forecast: ForecastDay[];
}

/**
 * Weather forecast component for multiple days
 */
export function Forecast({ forecast }: ForecastProps): React.ReactElement {
  if (!forecast || forecast.length === 0) {
    return <></>;
  }

  return (
    <div className="forecast-container">
      <h3 className="forecast-title">Прогноз на 7 дней</h3>
      <div className="forecast-grid">
        {forecast.map((day, index) => (
          <div key={index} className="forecast-card">
            <div className="forecast-date">{day.date}</div>
            <div className="forecast-icon-container">
              <img
                src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                alt={day.description}
                className="forecast-icon"
              />
            </div>
            <div className="forecast-temps">
              <span className="forecast-temp-max">{day.temp_max}°</span>
              <span className="forecast-temp-min">{day.temp_min}°</span>
            </div>
            <div className="forecast-description">{day.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
