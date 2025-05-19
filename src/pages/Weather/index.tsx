import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { weatherService } from '../../services/weather';
import { WeatherData } from '../../types/weather';
import { useNavigate } from 'react-router-dom';

const WeatherContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 20px;
  background-color: #f5f5f5;
`;

const WeatherCard = styled.div`
  width: 100%;
  max-width: 500px;
  padding: 30px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const Temperature = styled.div`
  font-size: 64px;
  font-weight: bold;
  margin: 20px 0;
`;

const Description = styled.div`
  font-size: 24px;
  color: #666;
  margin-bottom: 20px;
  text-transform: capitalize;
`;

const WindSpeed = styled.div`
  font-size: 18px;
  color: #888;
`;

const LogoutButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 10px 20px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #c82333;
  }
`;

const WeatherIcon = styled.img`
  width: 100px;
  height: 100px;
`;

const UpdateInfo = styled.div`
  font-size: 14px;
  color: #999;
  margin-top: 20px;
`;

const OfflineWarning = styled.div`
  background-color: #fff3cd;
  color: #856404;
  padding: 10px;
  border-radius: 4px;
  margin-top: 10px;
  text-align: center;
`;

export const WeatherPage: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const navigate = useNavigate();

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      if (!isOnline) {
        setError('Нет подключения к интернету');
        return;
      }

      try {
        setIsLoading(true);
        const data = await weatherService.getCurrentWeather();
        setWeather(data);
        setLastUpdate(new Date());
        setError(null);
      } catch {
        setError('Ошибка при загрузке данных о погоде');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, [isOnline]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (isLoading) {
    return (
      <WeatherContainer>
        <WeatherCard>
          <h1>Загрузка...</h1>
        </WeatherCard>
      </WeatherContainer>
    );
  }

  if (error) {
    return (
      <WeatherContainer>
        <WeatherCard>
          <h1>Ошибка</h1>
          <p>{error}</p>
        </WeatherCard>
      </WeatherContainer>
    );
  }

  return (
    <WeatherContainer>
      <LogoutButton onClick={handleLogout}>Выйти</LogoutButton>
      <WeatherCard>
        <h1>Погода в Москве</h1>
        {!isOnline && (
          <OfflineWarning>
            Нет подключения к интернету. Данные могут быть устаревшими.
          </OfflineWarning>
        )}
        {weather && (
          <>
            <WeatherIcon
              src={`http://openweathermap.org/img/w/${weather.weather[0].icon}.png`}
              alt={weather.weather[0].description}
            />
            <Temperature>{Math.round(weather.main.temp)}°C</Temperature>
            <Description>{weather.weather[0].description}</Description>
            <WindSpeed>Скорость ветра: {weather.wind.speed} м/с</WindSpeed>
            {lastUpdate && (
              <UpdateInfo>Последнее обновление: {lastUpdate.toLocaleTimeString()}</UpdateInfo>
            )}
          </>
        )}
      </WeatherCard>
    </WeatherContainer>
  );
};
