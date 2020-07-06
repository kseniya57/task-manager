import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';

import errors from './errors';
import models from './models';
import params from './params';

export default [
  cors(),
  errors,
  models,
  bodyParser(),
  params,
];
