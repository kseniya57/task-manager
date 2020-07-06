import Koa from 'koa';
import controller from './models/Controller';
import middlewares from './middlewares';

export default () => {
  const app = new Koa();

  middlewares.forEach(middleware => app.use(middleware));

  app.use(controller.routes());

  app.listen(process.env.WEB_PORT);
};
