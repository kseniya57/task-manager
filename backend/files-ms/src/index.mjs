import Koa from 'koa';
import serve from 'koa-static';
import cors from '@koa/cors';
import bodyParser from 'koa-body';

import routes from './controllers';

const app = new Koa();

app.use(cors());

app.use(serve(process.env.UPLOADS_PATH.replace('./', '')));
app.use(serve(process.env.SKETCH_PATH));

app.use(bodyParser());

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (e) {
    console.error(e.message);
    ctx.body = {
      error: true,
      message: e.message,
    };
  }
});

app.use(routes);

app.listen(process.env.WEB_PORT);
