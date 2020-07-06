import Router from 'koa-router';

import upload from './upload';
import remove from './remove';
import file from './file';

const router = new Router();

router.post('/upload', ...upload);
router.delete('/remove', remove);
router.post('/file', file);

export default router.routes();
