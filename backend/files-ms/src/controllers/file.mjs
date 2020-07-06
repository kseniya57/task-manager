import fs from '../utils/fs';

export default async (ctx) => {
  const { path } = ctx.request.body;

  ctx.body = { file: (await fs.readFile(path)).toString() };
};