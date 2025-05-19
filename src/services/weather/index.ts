import axios from 'axios';

const API_KEY = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;

export const weatherService = {
  getCurrentWeather: async () => {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=Moscow&appid=${API_KEY}&units=metric&lang=ru`
    );
    return response.data;
  },
};