module.exports = {
  apps: [{
    name: 'repositories',
    script: 'src/index.mjs',
    node_args: '--experimental-modules',
    env: {
      APP_NAME: 'repositories',
      TABLE_NAME: 'repositories',
      WEB_PORT: 9999,
      USER_FIELD: 'creator_id',
      RELATED_TABLES: 'user'
    },
    env_development: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }]
};
