// Konfigurasi PM2 untuk frontend - format CommonJS
module.exports = {
  apps: [
    {
      name: 'rental-frontend',
      script: 'pnpm',
      args: 'start',
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
