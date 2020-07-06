module.exports = {
  apps: [{
    name: 'auth',
    script: 'src/index.mjs',
    node_args: '--experimental-modules',
    env: {
      APP_NAME: 'auth',
      TABLE_NAME: 'users',
      WEB_PORT: 9000,
      JWT_SECRET: 'this'
    },
    env_development: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }]
};