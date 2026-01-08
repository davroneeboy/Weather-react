import React, { useState } from 'react';

const api = {
  key: process.env.REACT_APP_API_KEY,
  base: process.env.REACT_APP_API_BASE || "https://api.openweathermap.org/data/2.5/"
}

function App() {
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const search = evt => {
    if (evt.key === "Enter" && query.trim()) {
      setLoading(true);
      setError('');
      fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
        .then(res => {
          if (!res.ok) {
            throw new Error('Ошибка запроса');
          }
          return res.json();
        })
        .then(result => {
          if (result.cod === '404') {
            setError('Город не найден. Попробуйте другой город.');
            setWeather({});
          } else {
            setWeather(result);
            setError('');
          }
          setQuery('');
          setLoading(false);
        })
        .catch(err => {
          setError('Ошибка при получении данных. Проверьте подключение к интернету.');
          setWeather({});
          setLoading(false);
        });
    }
  }

  const dateBuilder = (d) => {
    const months = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
    const days = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];

    const day = days[d.getDay()];
    const date = d.getDate();
    const month = months[d.getMonth()];
    const year = d.getFullYear();

    return `${day}, ${date} ${month} ${year}`
  }

  return (
    <div className={(typeof weather.main !== "undefined") ? ((weather.main.temp > 16) ? 'app warm' : 'app') : 'app'}>
      <main>
        <div className="search-box">
          <input 
            type="text"
            className="search-bar"
            placeholder="Введите название города..."
            onChange={e => setQuery(e.target.value)}
            value={query}
            onKeyDown={search}
            disabled={loading}
          />
        </div>
        {loading && (
          <div className="loading">Загрузка...</div>
        )}
        {error && (
          <div className="error">{error}</div>
        )}
        {(typeof weather.main !== "undefined") ? (
        <div>
          <div className="location-box">
            <div className="location">{weather.name}, {weather.sys.country}</div>
            <div className="date">{dateBuilder(new Date())}</div>
          </div>
          <div className="weather-box">
            <div className="temp">
              {Math.round(weather.main.temp)}°c
            </div>
            <div className="weather">{weather.weather[0].main}</div>
          </div>
        </div>
        ) : (!loading && !error && (
          <div className="welcome">
            <p>Введите название города для получения информации о погоде</p>
          </div>
        ))}
      </main>
    </div>
  );
}

export default App;
