import React from 'react';

interface ErrorProps {
  message: string;
}

/**
 * Error message display component
 */
export function Error({ message }: ErrorProps): JSX.Element {
  return <div className="error">{message}</div>;
}
