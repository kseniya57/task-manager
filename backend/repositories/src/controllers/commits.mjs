import git from '../utils/git';

export default async (ctx) => {
  const { limit } = ctx.params;

  ctx.body = await git(`log ${limit ? `-${limit}` : ''}`);
};
