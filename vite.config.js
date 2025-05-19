import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
    base: '/weather-in-moscow/', // Укажите базовый путь
    plugins: [react()],
});
