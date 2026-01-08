import React from 'react';
import { FiAlertCircle } from 'react-icons/fi';

interface ErrorProps {
  message: string;
}

/**
 * Error message display component
 */
export function Error({ message }: ErrorProps): React.ReactElement {
  return (
    <div className="error-container">
      <FiAlertCircle className="error-icon" />
      <div className="error-message">{message}</div>
    </div>
  );
}
