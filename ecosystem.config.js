module.exports = {
  apps: [
    {
      name: 'VueSsrDemo',
      script: './dist/server/server.js',
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
}
