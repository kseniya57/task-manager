import session from './session';
import auth from './auth';

export default (app) => {
  session(app);

  [auth]
    .forEach(middleware => app.use(middleware));
};
