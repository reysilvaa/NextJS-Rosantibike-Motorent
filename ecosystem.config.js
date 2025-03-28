module.exports = {
    apps: [
      {
        name: "rental-frontend",
        script: "npm",
        args: "start",
        exec_mode: "cluster",
        instances: "max",
        env: {
          NODE_ENV: "production",
          PORT: 3001
        },
        autorestart: true,
        watch: false,
        max_memory_restart: "1G"
      }
    ]
  };
  