import apolloRestDatasource from 'apollo-datasource-rest';

const { RESTDataSource } = apolloRestDatasource;

export default class AuthAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'http://localhost:9000';
  }

  check(token) {
    return this.post('check', { token });
  }

  login(data) {
    return this.post('login', { data });
  }

  register(data) {
    return this.post('register', { data });
  }
}
