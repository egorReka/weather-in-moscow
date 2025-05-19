import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = 'reqres-free-v1';

export const authService = {
  login: async (email: string, password: string) => {
    try {
      const response = await axios.post(
        `${API_URL}/login`,
        {
          email,
          password,
        },
        {
          headers: {
            'x-api-key': API_KEY,
          },
        }
      );

      if (response.data && response.data.token) {
        return response.data;
      } else {
        throw new Error('Неверный формат ответа от сервера');
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        // Ошибка от сервера
        if (error.response.status === 401) {
          throw new Error('Неверный email или пароль');
        } else {
          throw new Error(`Ошибка сервера: ${error.response.status}`);
        }
      } else if (axios.isAxiosError(error) && error.request) {
        // Ошибка сети
        throw new Error('Ошибка сети. Проверьте подключение к интернету');
      } else {
        // Другие ошибки
        throw new Error(error instanceof Error ? error.message : 'Произошла неизвестная ошибка');
      }
    }
  },
};
