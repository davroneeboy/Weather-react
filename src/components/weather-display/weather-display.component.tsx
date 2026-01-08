import React from 'react';
import { WeatherData } from '../../types/weather.types';
import { buildFormattedDate } from '../../utils/date.util';
import { 
  WiBarometer,
  WiSunrise,
  WiSunset
} from 'react-icons/wi';
import { 
  FiDroplet,
  FiThermometer,
  FiWind,
  FiEye
} from 'react-icons/fi';

interface WeatherDisplayProps {
  weather: WeatherData;
}

/**
 * Weather information display component
 */
export function WeatherDisplay({ weather }: WeatherDisplayProps): React.ReactElement {
  const formattedDate = buildFormattedDate(new Date());
  const temperature = Math.round(weather.main.temp);
  const feelsLike = Math.round(weather.main.feels_like);
  const tempMin = Math.round(weather.main.temp_min);
  const tempMax = Math.round(weather.main.temp_max);
  const weatherCondition = weather.weather[0]?.main || '';
  const weatherDescription = weather.weather[0]?.description || '';
  const iconCode = weather.weather[0]?.icon || '';
  const weatherIconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  const getWindDirection = (deg: number): string => {
    const directions = ['С', 'СВ', 'В', 'ЮВ', 'Ю', 'ЮЗ', 'З', 'СЗ'];
    return directions[Math.round(deg / 45) % 8];
  };

  return (
    <div className="weather-container">
      <div className="location-box">
        <div className="location">
          {weather.name}, {weather.sys.country}
        </div>
        <div className="date">{formattedDate}</div>
      </div>

      <div className="weather-main">
        <div className="weather-icon-container">
          <img 
            src={weatherIconUrl} 
            alt={weatherDescription}
            className="weather-icon"
          />
        </div>
        <div className="temperature-section">
          <div className="temp">{temperature}°</div>
          <div className="weather-description">{weatherDescription}</div>
        </div>
        <div className="feels-like">
          Ощущается как {feelsLike}°
        </div>
      </div>

      <div className="weather-details-grid">
        <div className="weather-card">
          <div className="weather-card-icon">
            <FiThermometer />
          </div>
          <div className="weather-card-content">
            <div className="weather-card-label">Мин / Макс</div>
            <div className="weather-card-value">{tempMin}° / {tempMax}°</div>
          </div>
        </div>

        <div className="weather-card">
          <div className="weather-card-icon">
            <FiDroplet />
          </div>
          <div className="weather-card-content">
            <div className="weather-card-label">Влажность</div>
            <div className="weather-card-value">{weather.main.humidity}%</div>
          </div>
        </div>

        <div className="weather-card">
          <div className="weather-card-icon">
            <WiBarometer />
          </div>
          <div className="weather-card-content">
            <div className="weather-card-label">Давление</div>
            <div className="weather-card-value">{weather.main.pressure} гПа</div>
          </div>
        </div>

        {weather.wind && (
          <div className="weather-card">
            <div className="weather-card-icon">
              <FiWind />
            </div>
            <div className="weather-card-content">
              <div className="weather-card-label">Ветер</div>
              <div className="weather-card-value">
                {Math.round(weather.wind.speed)} м/с {getWindDirection(weather.wind.deg)}
              </div>
            </div>
          </div>
        )}

        {weather.visibility && (
          <div className="weather-card">
            <div className="weather-card-icon">
              <FiEye />
            </div>
            <div className="weather-card-content">
              <div className="weather-card-label">Видимость</div>
              <div className="weather-card-value">
                {weather.visibility >= 1000 
                  ? `${(weather.visibility / 1000).toFixed(1)} км` 
                  : `${weather.visibility} м`}
              </div>
            </div>
          </div>
        )}

        <div className="weather-card">
          <div className="weather-card-icon">
            <WiSunrise />
          </div>
          <div className="weather-card-content">
            <div className="weather-card-label">Восход</div>
            <div className="weather-card-value">{formatTime(weather.sys.sunrise)}</div>
          </div>
        </div>

        <div className="weather-card">
          <div className="weather-card-icon">
            <WiSunset />
          </div>
          <div className="weather-card-content">
            <div className="weather-card-label">Закат</div>
            <div className="weather-card-value">{formatTime(weather.sys.sunset)}</div>
          </div>
        </div>

        {weather.clouds && (
          <div className="weather-card">
            <div className="weather-card-icon">
              <FiDroplet />
            </div>
            <div className="weather-card-content">
              <div className="weather-card-label">Облачность</div>
              <div className="weather-card-value">{weather.clouds.all}%</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
