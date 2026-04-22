import { defineConfig, loadEnv } from 'vite';
export default defineConfig(({ mode }) => {
    // .env
    const env = loadEnv(mode, '../../', '');
    return {
        server: {
            port: parseInt(env.FRONTEND_PORT) || 5173,
            proxy: {
                '/api': {
                    target: `http://localhost:${env.BACKEND_PORT || 8080}`,
                    changeOrigin: true,
                    secure: false,
                }
            }
        }
    };
});