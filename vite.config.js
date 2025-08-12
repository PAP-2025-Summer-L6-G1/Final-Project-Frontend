import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mkcert from 'vite-plugin-mkcert'

// https://vite.dev/config/
export default defineConfig({
      server: {
        https: {
          key: '../localhost-key.pem',
          cert: '../localhost.pem',
        },
      },
      plugins: [mkcert(), react()],
    })