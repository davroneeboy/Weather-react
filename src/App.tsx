import React, { useState, useCallback } from 'react';
import { WeatherData } from './types/weather.types';
import { WeatherService } from './services/weather.service';
import { API_CONFIG } from './constants/api.constants';
import { isValidWeatherData, getWeatherClassName, extractErrorMessage } from './utils/weather.util';
import { SearchBox } from './components/search-box/search-box.component';
import { WeatherDisplay } from './components/weather-display/weather-display.component';
import { Loading } from './components/loading/loading.component';
import { Error } from './components/error/error.component';
import { Welcome } from './components/welcome/welcome.component';

const weatherService = new WeatherService(API_CONFIG);

/**
 * Main application component for weather display
 */
function App(): React.ReactElement {
  const [query, setQuery] = useState<string>('');
  const [weather, setWeather] = useState<WeatherData | Record<string, never>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSearch = useCallback(async (): Promise<void> => {
    if (!query.trim()) {
      return;
    }
    setIsLoading(true);
    setErrorMessage('');
    try {
      const weatherData = await weatherService.fetchWeatherByCity(query.trim());
      setWeather(weatherData);
      setQuery('');
    } catch (err: unknown) {
      const errorMessage = extractErrorMessage(err, 'Ошибка при получении данных. Проверьте подключение к интернету.');
      setErrorMessage(errorMessage);
      setWeather({});
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  const handleQueryChange = useCallback((newQuery: string): void => {
    setQuery(newQuery);
  }, []);

  const hasWeatherData = isValidWeatherData(weather);
  const shouldShowWelcome = !isLoading && !errorMessage && !hasWeatherData;
  const className = getWeatherClassName(weather);

  return (
    <div className={className}>
      <main>
        <SearchBox
          query={query}
          isLoading={isLoading}
          onQueryChange={handleQueryChange}
          onSearch={handleSearch}
        />
        {isLoading && <Loading />}
        {errorMessage && <Error message={errorMessage} />}
        {hasWeatherData && <WeatherDisplay weather={weather} />}
        {shouldShowWelcome && <Welcome />}
      </main>
    </div>
  );
}

export default App;
