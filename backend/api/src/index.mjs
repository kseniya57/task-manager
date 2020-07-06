import Koa from 'koa';
import apollo from 'apollo-server-koa';
import fs from 'fs';
import cors from '@koa/cors';

import resolvers from './resolvers';
import dataSources from './dataSources';
import createContext from './context';
import applyMiddlewares from './middlewares';

const schema = fs.readFileSync('./src/schema.graphql', {
  encoding: 'utf8',
});

const app = new Koa();

app.use(cors());

applyMiddlewares(app);

const WEB_PORT = process.env.WEB_PORT || 4000;

const httpServer = app.listen(
  { port: WEB_PORT },
  () => console.log(`🚀 Server ready at http://localhost:${WEB_PORT}/graphql`),
);

const apolloServer = new apollo.ApolloServer({
  typeDefs: schema,
  resolvers,
  context: createContext,
  dataSources,
  subscriptions: {
    path: '/graphql',
    onConnect: async (connection, ws) => {
      const context = await createContext({ connection, ws });

      context.dataSources = dataSources();

      Object.values(context.dataSources).forEach(dataSource => dataSource.initialize && dataSource.initialize({ context }));

      return context;
    },
  },
  engine: false,
  tracing: true,
  cacheControl: true,
});

apolloServer.applyMiddleware({ app });

apolloServer.installSubscriptionHandlers(httpServer);
