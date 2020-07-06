import session from 'koa-session';

export default (app) => {
  // eslint-disable-next-line no-param-reassign
  app.keys = ['key'];
  app.use(session(null, app));
};
