module.exports = {
  apps: [{
    name: 'api',
    script: 'src/index.mjs',
    node_args: '--experimental-modules',
    env: {
      WEB_PORT: 4000
    },
    env_development: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }]
};