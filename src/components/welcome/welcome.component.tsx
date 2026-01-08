import React from 'react';
import { FiCloud, FiMapPin, FiSearch, FiThermometer, FiDroplet, FiWind } from 'react-icons/fi';

/**
 * Welcome message component displayed when no weather data is available
 */
export function Welcome(): React.ReactElement {
  return (
    <div className="welcome-container">
      <div className="welcome-header">
        <FiCloud className="welcome-icon" />
        <h2>Добро пожаловать в Weather App!</h2>
        <p className="welcome-subtitle">Узнайте актуальную погоду в любом городе мира</p>
      </div>

      <div className="welcome-features">
        <div className="welcome-feature-card">
          <div className="welcome-feature-icon">
            <FiSearch />
          </div>
          <h3>Быстрый поиск</h3>
          <p>Найдите погоду в любом городе, просто введя его название</p>
        </div>

        <div className="welcome-feature-card">
          <div className="welcome-feature-icon">
            <FiThermometer />
          </div>
          <h3>Детальная информация</h3>
          <p>Температура, влажность, давление, ветер и многое другое</p>
        </div>

        <div className="welcome-feature-card">
          <div className="welcome-feature-icon">
            <FiMapPin />
          </div>
          <h3>Прогноз на неделю</h3>
          <p>Планируйте заранее с прогнозом погоды на 7 дней</p>
        </div>

        <div className="welcome-feature-card">
          <div className="welcome-feature-icon">
            <FiDroplet />
          </div>
          <h3>Точные данные</h3>
          <p>Информация обновляется в реальном времени</p>
        </div>
      </div>

      <div className="welcome-cta">
        <p className="welcome-cta-text">Введите название города в поле поиска выше, чтобы начать</p>
      </div>
    </div>
  );
}
