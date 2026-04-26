import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { defineConfig } from 'vite';

const SSL_KEY_PATH = path.resolve(__dirname, process.env.SSL_KEY_PATH || '../certs/client-key.pem');
const SSL_CERT_PATH = path.resolve(__dirname, process.env.SSL_CERT_PATH || '../certs/client-cert.pem');
const ALLOWED_HOSTS = process.env.ALLOWED_HOSTS ? process.env.ALLOWED_HOSTS.split(',') : ['localhost'];

const getHttpsConfig = () => {
  if (fs.existsSync(SSL_KEY_PATH) && fs.existsSync(SSL_CERT_PATH)) {
    return {
      key: fs.readFileSync(SSL_KEY_PATH),
      cert: fs.readFileSync(SSL_CERT_PATH)
    };
  }
  console.warn('SSL certificates not found, falling back to HTTP.');
  return undefined;
};

export default defineConfig({
  plugins: [react()],
  server: {
    port: 4000
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  preview: {
    port: 443,
    host: true,
    allowedHosts: ALLOWED_HOSTS,
    https: getHttpsConfig()
  }
});
