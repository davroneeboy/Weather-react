import React from 'react';

interface ErrorProps {
  message: string;
}

/**
 * Error message display component
 */
export function Error({ message }: ErrorProps): React.ReactElement {
  return <div className="error">{message}</div>;
}
