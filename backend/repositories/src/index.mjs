import { launch, middlewares } from 'base';
import './controllers';
import serve from 'koa-static';

middlewares.unshift(serve('data'));

launch();
