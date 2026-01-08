import React from 'react';
import { FiCloud } from 'react-icons/fi';

/**
 * Welcome message component displayed when no weather data is available
 */
export function Welcome(): React.ReactElement {
  return (
    <div className="welcome-container">
      <FiCloud className="welcome-icon" />
      <div className="welcome-text">
        <h2>Добро пожаловать!</h2>
        <p>Введите название города для получения информации о погоде</p>
      </div>
    </div>
  );
}
