import axios from 'axios';
import isNotNull from '../utils/isNotNull';

export default async (ctx, next) => {
  let { userId } = ctx.session;

  if (!userId) {
    const token = ctx.authorization || ctx.request.header.authorization;

    if (isNotNull(token)) {
      const { data: { user } } = await axios.post('http://localhost:9000/check', {
        token,
      });

      if (user) {
        userId = user.id;
        ctx.session.userId = userId;
      }
    }
  }

  await next();
};
