import apolloRestDatasource from 'apollo-datasource-rest';
import BaseAPI from './base';

const { RESTDataSource } = apolloRestDatasource;

export default class RepositoryAPI extends BaseAPI {
  constructor() {
    super(9999);
  }

  repository(params) {
    return this.post('repository', params)
  }

  commits(params) {
    return this.post('commits', params)
  }

  branches(params) {
    return this.post('branches', params)
  }

  tags(params) {
    return this.post('tags', params)
  }

  mrs(params) {
    return this.post('mrs', params)
  }

  mr(params) {
    return this.post('mr', params)
  }

  async add(data, object) {
    try {
      const result = await super.add(data, object);
      this.post('create', { name: data.name, projectId: data.project_id });
      return result;
    } catch (e) {
      throw e;
    }
  }
}
