import GraphQLJSON from 'graphql-type-json';
import GraphQLDate from './types/Date';
import GraphQLObject from './types/Object';
import capitalize from './utils/capitalize';
import graphqlSubscriptions from 'graphql-subscriptions';
import toPlural from "./utils/toPlural";

const addEvent = async (name, data, dataSources, pubsub) => {
  const events = await dataSources.event.add(name, data);
  events.forEach(eventAdded => pubsub.publish('eventAdded', { eventAdded }));
};

const createDefaultQueries = names => names.reduce((map, name) => Object.assign(map, {
  [toPlural(name)]: async (parent, params, { dataSources }) => dataSources[name].getAll(params),
  [name]: async (parent, { id }, { dataSources }) => dataSources[name].getById(id),
}), {});

const createDefaultMutations = names => names.reduce((map, name) => Object.assign(map, {
  [`add${capitalize(name)}`]: async (_, { input, object }, { dataSources, pubsub }) => {
    const data = await dataSources[name].add(input, object);

    pubsub.publish(`${name}Added`, { [`${name}Added`]: { ...input, ...data, object } });

    addEvent(name, { type: 'add', data, object }, dataSources, pubsub).catch(console.error);

    return data;
  },
  [`update${capitalize(name)}`]: async (_, { id, input }, { dataSources, pubsub }) => {
    const { oldData, data } = await dataSources[name].update(id, input);

    pubsub.publish(`${name}Updated`, { [`${name}Updated`]: data });

    addEvent(name, { type: 'update', data, oldData }, dataSources, pubsub).catch(console.error);

    return data;
  },
  [`delete${capitalize(name)}`]: async (_, { id, object }, { dataSources, pubsub }) => {
    const result = await dataSources[name].remove(id, object);

    if (result) {
      pubsub.publish(`${name}Deleted`, { [`${name}Deleted`]: { id, object } });
      addEvent(name, { type: 'delete', data: { id }, object }, dataSources, pubsub).catch(console.error);
    }

    return result;
  },
}), {});

const createDefaultSubscribtions = names => names.reduce((map, name) => Object.assign(
  map,
  ['Added', 'Updated', 'Deleted'].reduce((acc, e) => Object.assign(
    acc, {
      [`${name}${e}`]: {
        subscribe: graphqlSubscriptions.withFilter(
          (parent, args, { pubsub }) => pubsub.asyncIterator([`${name}${e}`]),
          (payload, { filter }) => !filter || Object.entries(filter).every(([key, value]) => payload[`${name}${e}`][key] === value)
        ),
        resolve: payload => payload[`${name}${e}`],
      },
    },
  ), {}),
), {});

export default {
  JSON: GraphQLJSON,

  Date: GraphQLDate,

  GraphQLObject,

  Query: {
    ...createDefaultQueries(['user', 'project', 'task', 'tag', 'todo', 'comment', 'team', 'notification', 'event', 'chat', 'message', 'repository']),
    check: async (_, { token }, { dataSources }) => dataSources.auth.check(token),
    commits: async (parent, params, { dataSources }) => dataSources.repository.commits(params),
    branches: async (parent, params, { dataSources }) => dataSources.repository.branches(params),
    gitRepository: async (parent, params, { dataSources }) => dataSources.repository.repository(params),
    repositoryTags: async (parent, params, { dataSources }) => dataSources.repository.tags(params),
    mrs: async (parent, params, { dataSources }) => dataSources.repository.mrs(params),
    mr: async (parent, params, { dataSources }) => dataSources.repository.mr(params),
  },
  Mutation: {
    ...createDefaultMutations(['project', 'task', 'tag', 'todo', 'comment', 'team', 'notification', 'chat', 'message', 'repository']),
    register: async (_, { user }, { dataSources }) => dataSources.auth.register(user),
    login: async (_, { user }, { dataSources }) => dataSources.auth.login(user),
    updateUser: async (_, { id, input }, { dataSources }) => dataSources.user.update(id, input)
  },
  Subscription: {
    ...createDefaultSubscribtions(['project', 'task', 'tag', 'todo', 'comment', 'team', 'notification', 'chat', 'message', 'repository']),
    eventAdded: {
      subscribe: (parent, args, { pubsub }) => pubsub.asyncIterator(['eventAdded']),
      resolve: payload => payload.eventAdded,
    },
  },
  User: {
    roles: ({ id }, _, { dataSources }) => dataSources.role.getAll({ relation: { name: 'role', id } }),
  },
  Project: {
    creator: ({ creator_id }, _, { dataSources }) => dataSources.user.getById(creator_id),
    users: ({ id }, _, { dataSources }) => dataSources.user.getAll({ relation: { name: 'project', id } }),
  },
  Task: {
    author: ({ author_id }, _, { dataSources }) => dataSources.user.getById(author_id),
    assigned_to: ({ assigned_to }, _, { dataSources }) => dataSources.user.getById(assigned_to),
    tags: ({ id }, _, { dataSources }) => dataSources.tag.getAll({ relation: { name: 'task', id } }),
    comments: ({ id }, _, { dataSources }) => dataSources.comment.getAll({
      relation: { name: 'task', id },
      filter: { parent_id: null },
    }),
  },
  Todo: {
    user: ({ user_id }, _, { dataSources }) => dataSources.user.getById(user_id),
    tags: ({ id }, _, { dataSources }) => dataSources.tag.getAll({ relation: { name: 'todo', id } }),
  },
  Comment: {
    user: ({ user_id }, _, { dataSources }) => dataSources.user.getById(user_id),
    parent: ({ parent_id }, _, { dataSources }) => dataSources.comment.getById(parent_id),
    children: ({ id }, _, { dataSources }) => dataSources.comment.getAll({ filter: { parent_id: id } }),
  },
  Team: {
    users: ({ id }, _, { dataSources }) => dataSources.user.getAll({ relation: { name: 'team', id } }),
  },
  Notification: {
    user: ({ user_id }, _, { dataSources }) => dataSources.user.getById(user_id),
  },
  Event: {
    user: ({ user_id }, _, { dataSources }) => dataSources.user.getById(user_id),
  },
  Chat: {
    users: ({ id }, _, { dataSources }) => dataSources.user.getAll({ relation: { name: 'chat', id } }),
    messages: ({ id }, _, { dataSources }) => dataSources.message.getAll({ filter: { chat_id: id } }),
    totals: ({ id }, _, { dataSources }) => dataSources.message.aggregate({ aggregation: 'count', field: 1, filter: { chat_id: id } }).then(result => result[0]),
    lastMessage: ({ id }, _, { dataSources }) => dataSources.message.getAll({ filter: { chat_id: id }, order: ['created_at', 'desc'], limit: 1 }).then(result => result[0]),
  },
  Message: {
    user: ({ user_id }, _, { dataSources }) => dataSources.user.getById(user_id),
  },
  Repository: {
    creator: ({ creator_id }, _, { dataSources }) => dataSources.user.getById(creator_id),
    users: ({ id }, _, { dataSources }) => dataSources.user.getAll({ relation: { name: 'repository', id } }),
  },
  Commit: {
    author: ({ author_email }, _, { dataSources }) => dataSources.user.getAll({ filter: { email: author_email }}).then(data => data && data[0]),
  },
};
