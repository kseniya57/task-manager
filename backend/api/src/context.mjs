import RedisPubSub from 'graphql-redis-subscriptions';
import auth from './middlewares/auth';
import isNotNull from './utils/isNotNull';

const pubsub = new RedisPubSub.RedisPubSub();

export default async ({ ctx = {}, connection }) => {
  if (connection) {
    const { context = {}, authorization } = connection;

    if (!authorization || (context.session && context.session.userId)) {
      return context;
    } if (isNotNull(authorization)) {
      Object.assign(ctx, context);
      ctx.session = ctx.session || {};
      ctx.authorization = authorization;
      await auth(ctx, () => null);
    }
  }

  ctx.pubsub = pubsub;

  return ctx;
};
