import jwt from 'jsonwebtoken';

export default async (ctx) => {
  const { token } = ctx.params;

  const userData = await jwt.verify(token, process.env.JWT_SECRET);

  ctx.body = {
    token,
    user: userData && userData.id && await ctx.table.get(userData.id),
  };
};
