import React from 'react';
import { FiSearch } from 'react-icons/fi';

interface SearchBoxProps {
  query: string;
  isLoading: boolean;
  onQueryChange: (query: string) => void;
  onSearch: () => void;
}

/**
 * Search box component for city input
 */
export function SearchBox({ query, isLoading, onQueryChange, onSearch }: SearchBoxProps): React.ReactElement {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Enter' && query.trim()) {
      onSearch();
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    onQueryChange(event.target.value);
  };

  const handleSearchClick = (): void => {
    if (query.trim()) {
      onSearch();
    }
  };

  return (
    <div className="search-box">
      <div className="search-container">
        <input
          type="text"
          className="search-bar"
          placeholder="Введите название города..."
          onChange={handleChange}
          value={query}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />
        <button
          type="button"
          className="search-button"
          onClick={handleSearchClick}
          disabled={isLoading || !query.trim()}
          aria-label="Поиск"
        >
          <FiSearch className="search-icon" />
        </button>
      </div>
    </div>
  );
}
