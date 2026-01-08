import React from 'react';

/**
 * Welcome message component displayed when no weather data is available
 */
export function Welcome(): JSX.Element {
  return (
    <div className="welcome">
      <p>Введите название города для получения информации о погоде</p>
    </div>
  );
}
