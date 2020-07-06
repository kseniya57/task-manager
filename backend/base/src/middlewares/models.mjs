import Table from '../models/Table';
import { TABLE_NAME } from '../constants';

export default async (ctx, next) => {
  ctx.table = new Table(TABLE_NAME);
  await next();
};
