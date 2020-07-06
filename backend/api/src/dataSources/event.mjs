import apolloRestDatasource from 'apollo-datasource-rest';

const { RESTDataSource } = apolloRestDatasource;

export default class EventAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'http://localhost:7777';
  }

  willSendRequest(request) {
    request.params.set('userId', this.context.session.userId);
  }

  async getAll(params) {
    return (await this.post('', params).then(data => data.reverse())) || [];
  }

  add(name, data) {
    return this.post(name, data);
  }
}
