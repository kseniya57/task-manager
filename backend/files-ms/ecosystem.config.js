module.exports = {
  apps: [{
    name: 'files',
    script: 'src/index.mjs',
    node_args: '--experimental-modules',
    env: {
      APP_NAME: 'files',
      WEB_PORT: 9500,
      UPLOADS_PATH: './uploads',
      SKETCH_PATH: 'sketch',
    }
  }]
};