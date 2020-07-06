import BaseAPI from './base';
import EventAPI from './event';
import AuthAPI from './auth';
import RepositoryAPI from './repository';

export default () => ({
  project: new BaseAPI(7000),
  user: new BaseAPI(7050),
  team: new BaseAPI(7100),
  task: new BaseAPI(8000),
  tag: new BaseAPI(8050),
  role: new BaseAPI(8100),
  comment: new BaseAPI(8150),
  notification: new BaseAPI(8200),
  event: new EventAPI(),
  chat: new BaseAPI(8300),
  message: new BaseAPI(8350),
  todo: new BaseAPI(8400),
  auth: new AuthAPI(),
  repository: new RepositoryAPI(),
});
