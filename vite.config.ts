import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    plugins: [react()],
    define: {
      'process.env.VITE_GEOREFERENCE_API_KEY': JSON.stringify(env.VITE_GEOREFERENCE_API_KEY ?? ''),
      'process.env.VITE_SELLERS_MIDDLEWARE_API_KEY': JSON.stringify(env.VITE_SELLERS_MIDDLEWARE_API_KEY ?? ''),
      'process.env.VITE_SELLERS_MIDDLEWARE_URL': JSON.stringify(
        env.VITE_SELLERS_MIDDLEWARE_URL ??
          'https://t7ln416bll.execute-api.us-east-2.amazonaws.com/dev/post_middleware'
      ),
      'process.env.VITE_ENABLE_SELLERS_MIDDLEWARE_CO': JSON.stringify(env.VITE_ENABLE_SELLERS_MIDDLEWARE_CO ?? ''),
    },
  }
})
