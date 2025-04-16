// Konfigurasi PM2 untuk frontend - format ESM
export default {
  apps: [
    {
      name: 'rental-frontend',
      script: 'npm',
      args: 'run start',
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