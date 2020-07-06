const appsMap = {
  projects: {
    count: 1,
    port: 7000,
    userField: 'creator_id',
    relations: 'user',
  },
  users: {
    count: 1,
    port: 7050
  },
  teams: {
    count: 1,
    port: 7100,
    relations: 'user'
  },
  tasks: {
    count: 1,
    port: 8000,
    userField: 'author_id',
    relations: 'tag,comment'
  },
  tags: {
    count: 1,
    port: 8050
  },
  roles: {
    count: 1,
    port: 8100
  },
  comments: {
    count: 1,
    port: 8150,
    userField: 'user_id',
  },
  chats: {
    count: 1,
    port: 8300,
    relations: 'user,message'
  },
  messages: {
    count: 1,
    port: 8350,
    userField: 'user_id'
  },
  todos: {
    count: 1,
    port: 8400,
    userField: 'user_id',
    relations: 'tag'
  },
};


const apps = Object.entries(appsMap).reduce((acc, [name, data]) => {
  acc.push(...Array.from({length: data.count}, (_, i) => ({
    name,
    script: 'src/index.mjs',
    node_args: '--experimental-modules',
    env: {
      APP_NAME: name,
      WEB_PORT: data.port + i,
      USER_FIELD: data.userField,
      RELATED_TABLES: data.relations
    },
    env_development: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  })));
  return acc;
}, []);


module.exports = {apps};
