import React from 'react';
import { WiDaySunny } from 'react-icons/wi';

/**
 * Loading indicator component
 */
export function Loading(): React.ReactElement {
  return (
    <div className="loading-container">
      <WiDaySunny className="loading-icon" />
      <div className="loading-text">Загрузка...</div>
    </div>
  );
}
