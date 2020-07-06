import apolloRestDatasource from 'apollo-datasource-rest';

const { RESTDataSource } = apolloRestDatasource;

export default class BaseAPI extends RESTDataSource {
  constructor(port) {
    super();
    this.baseURL = `http://localhost:${port}`;
  }

  willSendRequest(request) {
    request.params.set('userId', this.context.session.userId);
  }

  async getAll(params) {
    return (await this.post('', params)) || [];
  }

  getById(id) {
    if (id) {
      return this.get(id.toString());
    }

    return null;
  }

  getByIds(ids) {
    return Promise.all(ids.map(id => this.getById(id)));
  }

  add(data, object) {
    return this.post('add', { data, object });
  }

  update(id, data) {
    return this.put(id.toString(), { data });
  }

  remove(id, object) {
    return this.delete(id.toString(), { object });
  }

  aggregate(params) {
    return this.post('aggregate', params)
  }
}
