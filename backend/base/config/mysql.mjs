const config = {
  development: {
    user: 'root',
    password: '12345678',
    host: 'localhost',
    database: 'shell',
  },
  production: {
    user: 'root',
    password: '12345678',
    host: 'localhost',
    database: 'shell',
  }
};

export default {
  connectionLimit: 1e2,
  ...config[process.env.NODE_ENV]
}