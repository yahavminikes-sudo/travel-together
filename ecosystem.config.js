module.exports = {
  apps: [
    {
      name: 'backend',
      script: 'node',
      args: 'dist/backend/src/index.js',
      cwd: './backend',
      env_production: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'frontend',
      script: 'npx',
      args: 'vite preview',
      cwd: './frontend',
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
};
