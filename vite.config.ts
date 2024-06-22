import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    base: '/ffxiv-gate-reminder',
    resolve: {
        alias: {
            '@/assets': path.resolve(__dirname, './src/assets'),
            '@/components': path.resolve(__dirname, './src/components'),
        },
    },
});
