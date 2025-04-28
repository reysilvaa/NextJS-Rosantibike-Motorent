// Konfigurasi PM2 untuk frontend
module.exports = {
  apps: [
    {
      name: 'rental-frontend',
      script: '.next/standalone/server.js',
      args: 'start -p 3001',
      cwd: './',
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
}; 