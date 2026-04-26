module.exports = {
  apps: [
    {
      name: 'backend',
      script: 'dist/backend/src/index.js',
      cwd: './backend',
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'frontend',
      script: 'npm',
      args: 'run preview',
      cwd: './frontend',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
