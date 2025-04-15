module.exports = {
    apps: [
      {
        name: "rental-frontend",
        script: "pnpm",
        args: "start",
        cwd: "/var/www/rosantibike/frontend",
        interpreter: "none",
        env: {
          NODE_ENV: "production",
          PORT: 3001
        },
        autorestart: true,
        watch: false,
        max_memory_restart: "700M"
      }
    ]
  };
  