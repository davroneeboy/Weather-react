import React from 'react';

interface SearchBoxProps {
  query: string;
  isLoading: boolean;
  onQueryChange: (query: string) => void;
  onSearch: () => void;
}

/**
 * Search box component for city input
 */
export function SearchBox({ query, isLoading, onQueryChange, onSearch }: SearchBoxProps): JSX.Element {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Enter' && query.trim()) {
      onSearch();
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    onQueryChange(event.target.value);
  };

  return (
    <div className="search-box">
      <input
        type="text"
        className="search-bar"
        placeholder="Введите название города..."
        onChange={handleChange}
        value={query}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
      />
    </div>
  );
}
