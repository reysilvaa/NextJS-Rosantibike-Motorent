module.exports = {
    apps: [
      {
        name: "rental-frontend",
        script: "npm",
        args: "run start",
        exec_mode: "cluster",
        instances: "max",
        env: {
          NODE_ENV: "production",
          PORT: 3001,
          NODE_OPTIONS: "--max-old-space-size=512"
        },
        autorestart: true,
        watch: false,
        max_memory_restart: "700M"
      }
    ]
  };
  