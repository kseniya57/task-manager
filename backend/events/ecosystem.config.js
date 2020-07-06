module.exports = {
  apps: [{
    name: 'events',
    script: 'src/index.mjs',
    node_args: '--experimental-modules',
    env: {
      APP_NAME: 'events',
      TABLE_NAME: 'events',
      WEB_PORT: 7777,
    },
    env_development: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }]
};